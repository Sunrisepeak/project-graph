import { ProgressNumber } from "../../ProgressNumber";
import Effect from "../effect";

/**
 * 文字上浮特效
 */
export default class TextRiseEffect extends Effect {
  constructor(
    public text: string,
    public override timeProgress: ProgressNumber = new ProgressNumber(0, 50),
  ) {
    super(timeProgress);
  }
}
