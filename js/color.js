export default class Color{
  constructor(red, green, blue){
    if (typeof red !== 'number') {
      throw new Error('parameter RED is not a number');
    }
    if (red < 0 || red > 255){
      throw new Error('parameter RED must be between 0 and 255');
    }
    if (typeof green !== 'number') {
      throw new Error('parameter GREEN is not a number');
    }
    if (green < 0 || green > 255){
      throw new Error('parameter GREEN must be between 0 and 255');
    }
    if (typeof blue !== 'number') {
      throw new Error('parameter BLUE is not a number');
    }
    if (blue < 0 || blue > 255){
      throw new Error('parameter BLUE must be between 0 and 255');
    }

    this.red = red;
    this.green = green;
    this.blue = blue;

    this.getStringColor = () => {
      return 'rgb('+this.red+', '+this.green+', '+this.blue+')';
    };

    this.getHtmlCode = () => {
      return "#"+((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1);
    };

  }
}
