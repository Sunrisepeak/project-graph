import { Color } from "../../../dataStruct/Color";
import { Rectangle } from "../../../dataStruct/shape/Rectangle";
import { Vector } from "../../../dataStruct/Vector";
import { TextNode } from "../../../stageObject/entity/TextNode";
import { Camera } from "../../../stage/Camera";
import { Renderer } from "../renderer";
import { RenderUtils } from "../RenderUtils";
import { Section } from "../../../stageObject/entity/Section";
import { CollisionBoxRenderer } from "./CollisionBoxRenderer";
import { ConnectPoint } from "../../../stageObject/entity/ConnectPoint";
import { replaceTextWhenProtect } from "../../../../utils/font";
import { Random } from "../../../algorithm/random";

/**
 * 处理节点相关的绘制
 */
export namespace EntityRenderer {
  export function renderSection(section: Section) {
    if (section.isHiddenBySectionCollapse) {
      return;
    }
    if (section.isCollapsed) {
      RenderUtils.renderRect(
        new Rectangle(
          Renderer.transformWorld2View(section.rectangle.location),
          section.rectangle.size.multiply(Camera.currentScale),
        ),
        section.color,
        new Color(204, 204, 204, 1),
        2 * Camera.currentScale,
        Renderer.NODE_ROUNDED_RADIUS * Camera.currentScale,
      );

      RenderUtils.renderText(
        section.text,
        Renderer.transformWorld2View(
          section.rectangle.location.add(Vector.same(Renderer.NODE_PADDING)),
        ),
        Renderer.FONT_SIZE * Camera.currentScale,
        colorInvert(section.color),
      );
    } else {
      RenderUtils.renderRect(
        new Rectangle(
          Renderer.transformWorld2View(section.rectangle.location),
          section.rectangle.size.multiply(Camera.currentScale),
        ),
        section.color,
        new Color(204, 204, 204, 1),
        2 * Camera.currentScale,
        Renderer.NODE_ROUNDED_RADIUS * Camera.currentScale,
      );

      RenderUtils.renderText(
        section.text,
        Renderer.transformWorld2View(
          section.rectangle.location.add(Vector.same(Renderer.NODE_PADDING)),
        ),
        Renderer.FONT_SIZE * Camera.currentScale,
        colorInvert(section.color),
      );
    }

    if (section.isSelected) {
      // 在外面增加一个框
      CollisionBoxRenderer.render(
        section.collisionBox,
        new Color(0, 255, 0, 0.5),
      );
    }
    // debug
    // RenderUtils.renderRect(
    //   section.collisionBox.getRectangle().transformWorld2View(),
    //   section.color,
    //   new Color(0, 2, 255, 1),
    //   0.5 * Camera.currentScale
    // )
  }

  export function renderNode(node: TextNode) {
    if (node.isHiddenBySectionCollapse) {
      return;
    }
    // 节点身体矩形
    RenderUtils.renderRect(
      new Rectangle(
        Renderer.transformWorld2View(node.rectangle.location),
        node.rectangle.size.multiply(Camera.currentScale),
      ),
      node.color,
      new Color(204, 204, 204, 1),
      2 * Camera.currentScale,
      Renderer.NODE_ROUNDED_RADIUS * Camera.currentScale,
    );

    if (!node.isEditing) {
      RenderUtils.renderText(
        Renderer.protectingPrivacy
          ? replaceTextWhenProtect(node.text)
          : node.text,
        Renderer.transformWorld2View(
          node.rectangle.location.add(Vector.same(Renderer.NODE_PADDING)),
        ),
        Renderer.FONT_SIZE * Camera.currentScale,
        colorInvert(node.color),
      );
    }

    if (node.isSelected) {
      // 在外面增加一个框
      CollisionBoxRenderer.render(node.collisionBox, new Color(0, 255, 0, 0.5));
    }
    if (node.isAiGenerating) {
      // 在外面增加一个框
      RenderUtils.renderRect(
        new Rectangle(
          Renderer.transformWorld2View(node.rectangle.location),
          node.rectangle.size.multiply(Camera.currentScale),
        ),
        node.color,
        new Color(0, 255, 0, Random.randomFloat(0.2, 1)),
        Random.randomFloat(1, 10) * Camera.currentScale,
        Renderer.NODE_ROUNDED_RADIUS * Camera.currentScale,
      );
    }

    if (node.details && !node.isEditingDetails) {
      if (Renderer.isAlwaysShowDetails) {
        renderNodeDetails(node);
      } else {
        if (node.isMouseHover) {
          renderNodeDetails(node);
        }
      }
    }
  }
  function renderNodeDetails(node: TextNode) {
    RenderUtils.renderMultiLineText(
      node.details,
      Renderer.transformWorld2View(
        node.rectangle.location.add(new Vector(0, node.rectangle.size.y)),
      ),
      Renderer.FONT_SIZE_DETAILS * Camera.currentScale,
      Renderer.NODE_DETAILS_WIDTH * Camera.currentScale,
    );
  }
  export function colorInvert(color: Color): Color {
    /**
     * 计算背景色的亮度 更精确的人眼感知亮度公式
     * 0.2126 * R + 0.7152 * G + 0.0722 * B，
     * 如果亮度较高，则使用黑色文字，
     * 如果亮度较低，则使用白色文字。
     * 这种方法能够确保无论背景色如何变化，文字都能保持足够的对比度。
     */

    const r = color.r;
    const g = color.g;
    const b = color.b;
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (brightness > 128) {
      return Color.Black; // 返回黑色
    } else {
      return Color.White; // 返回白色
    }
  }

  export function renderConnectPoint(connectPoint: ConnectPoint) {
    if (connectPoint.isSelected) {
      // 在外面增加一个框
      CollisionBoxRenderer.render(
        connectPoint.collisionBox,
        new Color(0, 255, 0, 0.5),
      );
    }
    RenderUtils.renderCircle(
      Renderer.transformWorld2View(connectPoint.geometryCenter),
      connectPoint.radius * Camera.currentScale,
      Color.Transparent,
      Color.White,
      2 * Camera.currentScale,
    );
  }
}
