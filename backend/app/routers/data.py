from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud, models
from ..database import get_db

router = APIRouter(
    prefix="/data",
    tags=["data"],
)


def get_shot_relationships_graph(db: Session):
    # Get all bets
    bets = db.query(models.Bet).all()

    # Create nodes (users) and edges (shot relationships)
    nodes = {}
    edges = []

    # Dictionary to track shots owed and shots owed to each user
    shots_owed_by_user = {}
    shots_owed_to_user = {}

    # Build the graph data
    for bet in bets:
        # Add users as nodes if they don't already exist
        if bet.bettor_id not in nodes:
            user = db.query(models.User).filter(models.User.id == bet.bettor_id).first()
            nodes[bet.bettor_id] = {"id": bet.bettor_id, "name": user.name}

        if bet.bettee_id not in nodes:
            user = db.query(models.User).filter(models.User.id == bet.bettee_id).first()
            nodes[bet.bettee_id] = {"id": bet.bettee_id, "name": user.name}

        # Add edges (shots between users)
        edges.append(
            {
                "from": bet.bettor_id,
                "to": bet.bettee_id,
                "value": bet.shots,
                "reason": bet.description,
                "outcome": bet.outcome,
                "dateCreated": bet.date_created,
                "id": bet.id,
            }
        )

        # Update shot counts for leaderboard
        if bet.bettor_id not in shots_owed_by_user:
            shots_owed_by_user[bet.bettor_id] = 0
        if bet.bettee_id not in shots_owed_to_user:
            shots_owed_to_user[bet.bettee_id] = 0

        # Skip over bets that have been resolved
        if bet.outcome:
            continue
        shots_owed_by_user[bet.bettor_id] += bet.shots
        shots_owed_to_user[bet.bettee_id] += bet.shots

    # Convert nodes from dict to a list for better JSON structure
    nodes_list = list(nodes.values())

    # Build the leaderboard based on shots owed
    leaderboard = []
    for user_id, node in nodes.items():
        leaderboard.append(
            {
                "id": user_id,
                "name": node["name"],
                "totalShotsOwed": shots_owed_by_user.get(user_id, 0),
                "totalShotsOwedTo": shots_owed_to_user.get(user_id, 0),
            }
        )

    # Sort the leaderboard by the total number of shots owed to the user
    leaderboard.sort(key=lambda user: user["totalShotsOwedTo"], reverse=True)

    return {
        "nodes": nodes_list,
        "edges": edges,
        "leaderboard": leaderboard,  # Include the leaderboard in the response
    }


@router.get("/graph", response_model=dict)
def get_user_shot_relationships(db: Session = Depends(get_db)):
    graph_data = get_shot_relationships_graph(db=db)
    return graph_data


@router.get("/events", response_model=dict)
def get_event_log(db: Session = Depends(get_db)):
    """
    Simple funtionality to translate the bet data into a list of events.
    Each bet can be transformed into several events. For simplicity, we'll focus on the following two:
    - A bet creation event (derived from the Bet.date_created)
    - A bet resolution event (derived from the Bet.outcome)

    The response will be a list of events, sorted by the event date.
    Events will be in the following JSON format:
    {
        "id": int,
        "type": str,
        "date": datetime,
        "description": str
    }

    The description field will contain the following information:
    - For bet creation events: "User A bet User B N shots: description"
    - For bet resolution events: "User A called N shots on User B"
    """

    # Get all bets
    bets = db.query(models.Bet).all()

    # Create a list of events
    events = []

    # Create a list of bet creation events
    for bet in bets:
        events.append(
            {
                "id": bet.id,
                "type": "bet_creation",
                "event_date": bet.date_created,
                "description": f"{bet.bettor.name} bet {bet.bettee.name} {bet.shots} shot(s): {bet.description}",
            }
        )

        # Create a bet resolution event if the bet has been resolved
        if bet.outcome and bet.outcome != "incomplete" and bet.outcome != "expired":
            try:
                outcome_date = datetime.strptime(bet.outcome[:-4], "%Y-%m-%dT%H:%M")
                print(bet.outcome)
                print(outcome_date)
                print("---")
                events.append(
                    {
                        "id": bet.id,
                        "type": "bet_resolution",
                        "event_date": outcome_date,
                        "description": f"{bet.bettor.name} called {bet.shots} shot(s) on {bet.bettee.name}",
                    }
                )
            except ValueError:
                print(f"Invalid date format: {bet.outcome}")

    # Sort the events by date
    events.sort(key=lambda event: event["event_date"], reverse=True)

    return {"events": events}
