import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Icon, InputGroup } from '@blueprintjs/core'

import "./SpeedTree.scss"

const SpeedTree = ({ data, expandThreshold }) => {
  const depth2Children = data.map((n) => (n.children ?? []).length).reduce((a,b) => a+b, 0);
  const expandFirstLayer = data.length === 1 || (!!expandThreshold && depth2Children + data.length <= expandThreshold)

  const [openedNodeIds, setOpenedNodeIds] = useState(expandFirstLayer ? data.map((n) => n.id) : []);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);

  const flattenOpened = treeData => {
    const result = [];
    for (let node of treeData) {
      flattenNode(node, 1, result);
    }
    return result;
  };

  const flattenNode = (node, depth, result) => {
    const { id, label, selectable, children } = node;
    let collapsed = !openedNodeIds.includes(id);
    let selected = selectable && selectedNodeIds.includes(id);
    result.push({
      id,
      label,
      selectable,
      hasChildren: children && children.length > 0,
      depth,
      collapsed,
      selected,
    });

    if (!collapsed && children) {
      for (let child of children) {
        flattenNode(child, depth + 1, result);
      }
    }
  };

  const flattenedData = flattenOpened(data);

  const onOpen = node =>
    node.collapsed
      ? setOpenedNodeIds([...openedNodeIds, node.id])
      : setOpenedNodeIds(openedNodeIds.filter(id => id !== node.id));

  const onSelect = (e, node) => {
    e.stopPropagation();
    node.selected
      ? setSelectedNodeIds(selectedNodeIds.filter(id => id !== node.id))
      : setSelectedNodeIds([...selectedNodeIds, node.id]);
  };

  const Row = ({ index, style }) => {
    const node = flattenedData[index];
    const left = (node.depth - 1) * 20;

    const caret_elem = <span
      className={`tree-node-caret ${node.collapsed ? 'tree-node-caret-closed' : 'tree-node-caret-open'
        }`}
      style={{ opacity: node.hasChildren ? 1 : 0 }}>
      <Icon icon={'chevron-right'} />
    </span>

    const visibility_elem = <span
      className={`${node.selected ? 'tree-label-visibility-on' : 'tree-label-visibility-off'} tree-label-visibility`}
      onClick={(e) => onSelect(e, node)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(e, node)}
      role="button"
      tabIndex={-1}>
      <Icon icon={node.selected ? 'eye-open' : 'eye-off'} />
    </span>

    return (
      <div
        className="item-background"
        style={{ ...style }}
        onClick={() => onOpen(node)}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(node)}
        role="button"
        tabIndex={index}
      >
        <div
          className={`${node.hasChildren ? 'tree-branch' : ''} ${node.collapsed ? 'tree-item-closed' : 'tree-item-open'
            }`}
          style={{
            position: 'absolute',
            left: `${left}px`,
            width: `calc(100% - ${left}px)`
          }}
        >
          {caret_elem}
          {node.label}
          {node.selectable && visibility_elem}
        </div>
      </div>
    );
  };

  const searchBox = false && <InputGroup />;

  return (
    <>
      {searchBox}
      <List
        className="List"
        height={flattenedData.length * 32}
        itemCount={flattenedData.length}
        itemSize={32}
        width={'100%'}
        itemKey={index => flattenedData[index].id}
      >
        {Row}
      </List>
    </>
  );
};

export default SpeedTree;
