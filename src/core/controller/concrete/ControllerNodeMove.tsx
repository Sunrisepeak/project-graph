import { StageManager } from "../../stage/stageManager/StageManager";
import { Renderer } from "../../render/canvas2d/renderer";
import { Stage } from "../../stage/Stage";
import { Vector } from "../../dataStruct/Vector";
import { Controller } from "../Controller";
import { ControllerClass } from "../ControllerClass";
import { Entity } from "../../stageObject/StageObject";

/**
 * 拖拽节点使其移动的控制器
 *
 */
export const ControllerNodeMove = new ControllerClass();

ControllerNodeMove.mousedown = (event: MouseEvent) => {
  if (event.button !== 0) {
    return;
  }

  const pressWorldLocation = Renderer.transformView2World(
    new Vector(event.clientX, event.clientY),
  );
  const isHaveNodeSelected = StageManager.getTextNodes().some(
    (node) => node.isSelected,
  );
  const isHaveSectionSelected = StageManager.getSections().some(
    (section) => section.isSelected,
  );
  ControllerNodeMove.lastMoveLocation = pressWorldLocation.clone();
  const clickedNode = StageManager.findTextNodeByLocation(pressWorldLocation);
  const clickedSection = StageManager.findSectionByLocation(pressWorldLocation);
  const clickedConnectPoint =
    StageManager.findConnectPointByLocation(pressWorldLocation);

  if (clickedSection !== null) {
    Controller.isMovingEntity = true;
    if (isHaveSectionSelected && !clickedSection.isSelected) {
      StageManager.getSections().forEach((section) => {
        section.isSelected = false;
      });
    }
    clickedSection.isSelected = true;
  }

  if (clickedConnectPoint !== null) {
    Controller.isMovingEntity = true;
    if (clickedConnectPoint && !clickedConnectPoint.isSelected) {
      StageManager.getConnectPoints().forEach((point) => {
        point.isSelected = false;
      });
    }
    clickedConnectPoint.isSelected = true;
  }

  if (clickedNode !== null) {
    Controller.isMovingEntity = true;
    if (isHaveNodeSelected && !clickedNode.isSelected) {
      StageManager.getTextNodes().forEach((node) => {
        node.isSelected = false;
      });
    }
    clickedNode.isSelected = true;
    // 同时清空所有边的选中状态
    StageManager.getAssociations().forEach((edge) => {
      edge.isSelected = false;
    });
  }
};

ControllerNodeMove.mousemove = (event: MouseEvent) => {
  if (Stage.isSelecting || Stage.isCutting) {
    return;
  }
  if (!Controller.isMovingEntity) {
    return;
  }
  const worldLocation = Renderer.transformView2World(
    new Vector(event.clientX, event.clientY),
  );
  const diffLocation = worldLocation.subtract(
    ControllerNodeMove.lastMoveLocation,
  );

  if (StageManager.isHaveEntitySelected()) {
    // 移动节点
    Controller.isMovingEntity = true;
    // 暂不监听alt键。因为windows下切换窗口时，alt键释放监听不到
    if (Controller.pressingKeySet.has("control")) {
      // 和子节点一起移动
      StageManager.moveNodesWithChildren(diffLocation);
    } else {
      StageManager.moveNodes(diffLocation);
    }
    StageManager.moveSections(diffLocation);
    StageManager.moveConnectPoints(diffLocation);

    ControllerNodeMove.lastMoveLocation = worldLocation.clone();
  }
};

ControllerNodeMove.mouseup = (event: MouseEvent) => {
  if (event.button !== 0) {
    return;
  }
  if (Controller.isMovingEntity) {
    // 如果是在SectionHover状态下松开鼠标的，将选中的东西放入Section
    const entityList: Entity[] = StageManager.getSelectedEntities();
    for (const section of Stage.hoverSections) {
      StageManager.goInSection(entityList, section);
    }
    StageManager.moveEntityFinished();
  }
  Controller.isMovingEntity = false;
};
