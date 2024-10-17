import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

type LeaderboardEntry = {
  id: number
  name: string
  totalShotsOwed: number
  totalShotsOwedTo: number
}

type SortKey = "name" | "totalShotsOwed" | "totalShotsOwedTo"
type SortOrder = "asc" | "desc"

type ShotBetsLeaderboardProps = {
  leaderboard: LeaderboardEntry[]
}

export default function ShotBetsLeaderboard({ leaderboard }: ShotBetsLeaderboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalShotsOwed")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [leaderboard, sortKey, sortOrder])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (column !== sortKey) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shot Bets Leaderboard</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead>
                <Button
                  variant="outline"
                  onClick={() => handleSort("name")}
                  className="font-bold"
                >
                  Name
                  <SortIcon column="name" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="outline"
                  onClick={() => handleSort("totalShotsOwed")}
                  className="font-bold"
                >
                  Shots Owed
                  <SortIcon column="totalShotsOwed" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="outline"
                  onClick={() => handleSort("totalShotsOwedTo")}
                  className="font-bold"
                >
                  Shots Owed To
                  <SortIcon column="totalShotsOwedTo" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLeaderboard.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.totalShotsOwed}</TableCell>
                <TableCell>{entry.totalShotsOwedTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}