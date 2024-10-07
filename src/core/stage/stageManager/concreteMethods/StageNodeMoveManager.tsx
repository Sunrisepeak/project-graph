import { Vector } from "../../../dataStruct/Vector";
import { StageManager } from "../StageManager";

/**
 * 管理节点的位置移动
 * 不仅仅有鼠标拖动的移动，还有对齐造成的移动
 * 以后还可能有自动布局的功能
 */
export namespace StageNodeMoveManager {
  /**
   * 拖动所有选中的节点一起移动
   * @param delta
   */
  export function moveNodes(delta: Vector) {
    for (const node of StageManager.nodes) {
      if (node.isSelected) {
        node.move(delta);
      }
    }
  }

  export function moveNodesWithChildren(delta: Vector) {
    for (const node of StageManager.nodes) {
      if (node.isSelected) {
        node.moveWithChildren(delta);
      }
    }
  }

  // 按住shift键移动

  // 对齐功能

  // 左侧对齐
  export function alignLeft() {
    const nodes = Array.from(StageManager.nodes).filter(
      (node) => node.isSelected,
    );
    const minX = Math.min(...nodes.map((node) => node.rectangle.location.x));
    for (const node of nodes) {
      node.rectangle.location.x = minX;
    }
  }

  // 右侧对齐
  export function alignRight() {
    const nodes = Array.from(StageManager.nodes).filter(
      (node) => node.isSelected,
    );
    const maxX = Math.max(
      ...nodes.map((node) => node.rectangle.location.x + node.rectangle.size.x),
    );
    for (const node of nodes) {
      node.rectangle.location.x = maxX - node.rectangle.size.x;
    }
  }

  // 上侧对齐
  export function alignTop() {
    const nodes = Array.from(StageManager.nodes).filter(
      (node) => node.isSelected,
    );
    const minY = Math.min(...nodes.map((node) => node.rectangle.location.y));
    for (const node of nodes) {
      node.rectangle.location.y = minY;
    }
  }

  // 下侧对齐
  export function alignBottom() {
    const nodes = Array.from(StageManager.nodes).filter(
      (node) => node.isSelected,
    );
    const maxY = Math.max(
      ...nodes.map((node) => node.rectangle.location.y + node.rectangle.size.y),
    );
    for (const node of nodes) {
      node.rectangle.location.y = maxY - node.rectangle.size.y;
    }
  }

  export function alignCenterHorizontal() {
    const nodes = Array.from(StageManager.nodes).filter(
      (node) => node.isSelected,
    );
    const centerY =
      Math.min(...nodes.map((node) => node.rectangle.location.y)) +
      Math.max(
        ...nodes.map(
          (node) =>
            node.rectangle.location.y +
            node.rectangle.size.y -
            node.rectangle.size.y / 2,
        ),
      );
    for (const node of nodes) {
      node.rectangle.location.y = centerY - node.rectangle.size.y / 2;
    }
  }

  export function alignCenterVertical() {
    const nodes = Array.from(StageManager.nodes).filter(
      (node) => node.isSelected,
    );
    const centerX =
      Math.min(...nodes.map((node) => node.rectangle.location.x)) +
      Math.max(
        ...nodes.map(
          (node) =>
            node.rectangle.location.x +
            node.rectangle.size.x -
            node.rectangle.size.x / 2,
        ),
      );
    for (const node of nodes) {
      node.rectangle.location.x = centerX - node.rectangle.size.x / 2;
    }
  }

  // 相等间距水平分布对齐
  export function alignHorizontalSpaceBetween() {
    const nodes = Array.from(StageManager.nodes).filter(node => node.isSelected);
    if (nodes.length <= 1) return; // 如果只有一个或没有选中的节点，则不需要重新排列
  
    const minX = Math.min(...nodes.map(node => node.rectangle.location.x));
    const maxX = Math.max(...nodes.map(node => node.rectangle.location.x + node.rectangle.size.x));
    const totalWidth = maxX - minX;
    const totalNodesWidth = nodes.reduce((sum, node) => sum + node.rectangle.size.x, 0);
    const availableSpace = totalWidth - totalNodesWidth;
    const spaceBetween = nodes.length > 1 ? availableSpace / (nodes.length - 1) : 0;
  
    let startX = minX;
    for (const node of nodes.sort((a, b) => a.rectangle.location.x - b.rectangle.location.x)) {
      node.rectangle.location.x = startX;
      startX += node.rectangle.size.x + spaceBetween;
    }
  }

  // 相等间距垂直分布对齐
  export function alignVerticalSpaceBetween() {
    const nodes = Array.from(StageManager.nodes).filter(node => node.isSelected);
    if (nodes.length <= 1) return; // 如果只有一个或没有选中的节点，则不需要重新排列
  
    const minY = Math.min(...nodes.map(node => node.rectangle.location.y));
    const maxY = Math.max(...nodes.map(node => node.rectangle.location.y + node.rectangle.size.y));
    const totalHeight = maxY - minY;
    const totalNodesHeight = nodes.reduce((sum, node) => sum + node.rectangle.size.y, 0);
    const availableSpace = totalHeight - totalNodesHeight;
    const spaceBetween = nodes.length > 1 ? availableSpace / (nodes.length - 1) : 0;
  
    let startY = minY;
    for (const node of nodes.sort((a, b) => a.rectangle.location.y - b.rectangle.location.y)) {
      node.rectangle.location.y = startY;
      startY += node.rectangle.size.y + spaceBetween;
    }
  }
}
