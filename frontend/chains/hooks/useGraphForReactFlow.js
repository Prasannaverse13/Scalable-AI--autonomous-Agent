import { useMemo } from "react";
import { useColorMode } from "@chakra-ui/color-mode";

export const getEdgeStyle = (colorMode) => {
  const linkColor = colorMode === "light" ? "black" : "white";
  const propColor = colorMode === "light" ? "#888" : "#666";

  return {
    LINK: {
      type: "LINK",
      style: {
        stroke: linkColor,
        strokeWidth: 2,
        strokeLinecap: "round",
      },
    },
    PROP: {
      type: "PROP",
      style: {
        stroke: propColor,
        strokeWidth: 2,
        strokeLinecap: "round",
      },
    },
  };
};

export const toReactFlowNode = (node, nodeType) => {
  return {
    id: node.id,
    type: nodeType?.display_type || "node",
    position: node.position,
    data: {
      type: nodeType,
      node,
    },
  };
};

/**
 * Convert the graphql graph to a react flow graph objects.
 * Including adding static root node.
 */
export const useGraphForReactFlow = (graph, types) => {
  const { colorMode } = useColorMode();

  const nodeTypes = useMemo(() => {
    const nodeTypes = {};
    types?.forEach((type) => {
      nodeTypes[type.id] = type;
    });
    return nodeTypes;
  }, [graph, types]);

  return useMemo(() => {
    const nodeMap = graph?.nodes;
    const nodeList = Object.values(nodeMap || {});

    const roots = nodeList.filter((node) => node.root);
    const nodes = nodeList.map((node) => {
      return toReactFlowNode(node, nodeTypes[node.node_type_id]);
    });

    const edgeStyle = getEdgeStyle(colorMode, "chain");
    const defaultEdgeStyle = edgeStyle.LINK;

    const edges =
      graph?.edges?.map((edge) => {
        const sourceType = nodeTypes[nodeMap[edge.source_id].node_type_id].type;
        return {
          id: edge.id,
          source: edge.source_id,
          target: edge.target_id,
          sourceHandle: edge.source_key,
          targetHandle: edge.target_key,
          // HAX: using === "in" works for some flow props but not all. This covers most cases
          // but will need to update when implicit maps and auto-masking is supported.
          ...(edgeStyle[edge.target_key === "in" ? "LINK" : edge.relation] ||
            defaultEdgeStyle),
          data: {
            id: edge.id,
          },
        };
      }) || [];

    // Deprecated direct roots: support for chains that haven't converted to the
    // new root node type.
    const hasDirectRoot = roots?.find((root) => root.class_path !== "__ROOT__");
    if (hasDirectRoot) {
      // Push static root and add an edge if a root node exists
      nodes.push({
        id: "root",
        type: "direct_root",
        position: { x: 100, y: 300 },
      });
      roots?.map((root, i) => {
        edges.push({
          id: `root_connector_${i}`,
          source: "root",
          target: root.id,
          sourceHandle: "out",
          targetHandle: "in",
          ...defaultEdgeStyle,
        });
      });
    }

    return { chain: graph?.chain, nodes, edges, root };
  }, [graph?.chain?.id, colorMode]);
};
