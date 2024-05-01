export const processingCreator = (item) => {
    switch (item.name) {
      case 'resize':
        if(!item.param1 || !item.param2){
          return false;
        }
        return "Resize " + item.param1 + "x" + item.param2;
      case 'colorspace':
        if(!item.param1){
          return false;
        }
        return "Colorspace: " + item.param1;
      case 'flip':
        if(!item.param1){
            return false;
        }
        if(item.param1 === "H"){
            return "Horizontal Flip";
        } else {
            return "Vertical Flip";
        }
      case 'flip H':
        return "Horizontal Flip";
      case 'flip V':
        return "Vertical Flip";
      case 'blur':
        if(!item.param1 || !(/^\d+$/.test(item.param1)) || parseInt(item.param1) % 2 !== 1){
          return false;
        }
        return "Blur: " + item.param1;
      case 'rotate':
        if(!item.param1){
          return false;
        }
        return "Rotate:  " + item.param1;
      default:
        break;
    }
}