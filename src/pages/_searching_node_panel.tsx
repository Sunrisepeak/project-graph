import React from "react";
import { useEffect } from "react";
import { Stage } from "../core/stage/Stage";
import { Controller } from "../core/controller/Controller";
import { StageManager } from "../core/stage/stageManager/StageManager";
import { RectangleNoteEffect } from "../core/effect/concrete/RectangleNoteEffect";
import { ProgressNumber } from "../core/dataStruct/ProgressNumber";
import { Color } from "../core/dataStruct/Color";
import { Camera } from "../core/stage/Camera";
import { useDialog } from "../utils/dialog";
import Button from "../components/ui/Button";
import Box from "../components/ui/Box";

export default function SearchingNodePanel() {
  const dialog = useDialog();
  // region 搜索相关
  const [isSearchingShow, setIsSearchingShow] = React.useState(false);
  const [currentSearchResultIndex, setCurrentSearchResultIndex] =
    React.useState(0);

  useEffect(() => {
    console.log("监听到搜索结果变化", Stage.currentSearchResultIndex);
    if (Stage.searchResultNodes.length == 0) {
      setCurrentSearchResultIndex(-1);
    } else {
      setCurrentSearchResultIndex(Stage.currentSearchResultIndex);
    }
  }, [Stage.currentSearchResultIndex]);

  const [searchResultCount, setSearchResultCount] = React.useState(0);
  useEffect(() => {
    setSearchResultCount(Stage.searchResultNodes.length);
  }, [Stage.searchResultNodes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (Controller.pressingKeySet.has("control") && event.key === "f") {
        Controller.pressingKeySet.clear();
        const searchString = prompt("请输入要搜索的节点名称");
        if (searchString) {
          // 开始搜索
          Stage.searchResultNodes = [];
          for (const node of StageManager.getTextNodes()) {
            if (node.text.includes(searchString)) {
              Stage.searchResultNodes.push(node);
            }
          }
          Stage.currentSearchResultIndex = 0;
          if (Stage.searchResultNodes.length > 0) {
            setIsSearchingShow(true);
            setCurrentSearchResultIndex(0);
            // 选择第一个搜索结果节点
            const currentNode =
              Stage.searchResultNodes[Stage.currentSearchResultIndex];
            // currentNode.isSelected = true;
            Stage.effects.push(
              new RectangleNoteEffect(
                new ProgressNumber(0, 50),
                currentNode.rectangle,
                Color.Green,
              ),
            );
            // 摄像机对准现在的节点
            Camera.location = currentNode.rectangle.center.clone();
          } else {
            dialog.show({
              title: "提示",
              type: "info",
              content: "没有找到匹配的节点",
            });
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  // endregion

  return (
    <>
      {isSearchingShow && (
        <Box className="fixed right-32 top-32 z-10 flex transform items-center p-4 opacity-50 hover:opacity-100">
          <span>
            {currentSearchResultIndex + 1}/{searchResultCount}
          </span>
          <Button
            className="m-2"
            onClick={() => {
              if (Stage.currentSearchResultIndex > 0) {
                Stage.currentSearchResultIndex--;
              }
              // 取消选择所有节点
              for (const node of StageManager.getTextNodes()) {
                node.isSelected = false;
              }
              // 选择当前搜索结果节点
              const currentNode =
                Stage.searchResultNodes[Stage.currentSearchResultIndex];
              Stage.effects.push(
                new RectangleNoteEffect(
                  new ProgressNumber(0, 50),
                  currentNode.rectangle,
                  Color.Green,
                ),
              );
              // 摄像机对准现在的节点
              Camera.location = currentNode.rectangle.center.clone();
            }}
          >
            上一项
          </Button>
          <Button
            className="m-2"
            onClick={() => {
              if (Stage.currentSearchResultIndex < searchResultCount - 1) {
                Stage.currentSearchResultIndex++;
              }
              // 取消选择所有节点
              for (const node of StageManager.getTextNodes()) {
                node.isSelected = false;
              }
              // 选择当前搜索结果节点
              const currentNode =
                Stage.searchResultNodes[Stage.currentSearchResultIndex];
              Stage.effects.push(
                new RectangleNoteEffect(
                  new ProgressNumber(0, 50),
                  currentNode.rectangle,
                  Color.Green,
                ),
              );
              // 摄像机对准现在的节点
              Camera.location = currentNode.rectangle.center.clone();
            }}
          >
            下一项
          </Button>
          <Button
            className="m-2"
            onClick={() => {
              setIsSearchingShow(false);
            }}
          >
            关闭
          </Button>
        </Box>
      )}
    </>
  );
}
