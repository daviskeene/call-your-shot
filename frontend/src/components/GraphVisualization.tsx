import React, { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

type GraphVisualizationProps = {
  query: any;
};

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ query }) => {
  const { data, isLoading, error } = query;

  const graphRef = useRef(null);

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  const graphData = {
    nodes: nodes.map((node: any) => ({
      id: node.id,
      name: node.name,
    })),
    links: edges.map((edge: any) => ({
      source: edge.from,
      target: edge.to,
      value: edge.value,
    })),
  };

  useEffect(() => {
    if (data && graphRef.current) {
        // TODO: Implement graph rendering
    }
  }, [data]);

  if (isLoading) return <div>Loading graph...</div>;
  if (error) return <div>Error loading graph.</div>;

  return (
    <div ref={graphRef} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
    }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="id"
        linkDirectionalArrowLength={2} // Arrow to show direction of who owes who
        linkDirectionalArrowRelPos={1}
        linkWidth={(link) => link.value} // Thicker lines for more shots owed
        linkColor={() => "#3b82f6"} // Customize link color
        backgroundColor="#ffffff"
        width={600}
        height={300}
      />
    </div>
  );
};

export default GraphVisualization;
