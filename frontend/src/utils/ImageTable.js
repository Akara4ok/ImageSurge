import { Image } from 'image-js';

const cosine_similarity_single = (A, B) => {
    let dotproduct = 0;
    let mA = 0;
    let mB = 0;

    for(let i = 0; i < A.length; i++) {
        dotproduct += A[i] * B[i];
        mA += A[i] * A[i];
        mB += B[i] * B[i];
    }

    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    const similarity = dotproduct / (mA * mB);

    return similarity;
}

const cosine_similarity = (array, B) => {
    const similarities = [];
    for (let index = 0; index < array.length; index++) {
        const A = array[index];
        similarities.push(cosine_similarity_single(A, B));
    }
    return similarities;
}

const recrop = (tl_x, tl_y, br_x, br_y, width, height, ref_width, ref_height) => {
    tl_x = (tl_x / width) * ref_width + 1;
    tl_y = (tl_y / height) * ref_height + 1;
    br_x = (br_x / width) * ref_width - 1;
    br_y = (br_y / height) * ref_height - 1;
    return {tl_x, tl_y, br_x, br_y}
}

class Cell{
    constructor(x, y, size_x, size_y){
        this.x = x;
        this.y = y;
        this.size_x = size_x;
        this.size_y = size_y;
        this.recognized_count = 0;
    }

    union(tl_x, tl_y, br_x, br_y){
        if(tl_x === -1){
            tl_x = this.x;
        } else {
            tl_x = Math.min(this.x, tl_x);
        }
            
        if(tl_y === -1){
            tl_y = this.y;
        } else {
            tl_y = Math.min(this.y, tl_y);
        }
            
        if(br_x === -1){
            br_x = this.x;
        } else {
            br_x = Math.max(this.x + this.size_x, br_x);
        }
            
        if(br_y === -1) {
            br_y = this.y;
        } else {
            br_y = Math.max(this.y + this.size_y, br_y);
        }
        return {tl_x, tl_y, br_x, br_y};
    }
}

class BigBox{
    constructor(small_boxes){
        this.x = small_boxes[0].x;
        this.y = small_boxes[0].y;
        let x2 = small_boxes[0].y;
        let y2 = small_boxes[0].y;
        for (let index = 0; index < small_boxes.length; index++) {
            const box = small_boxes[index];
            this.x = Math.min(this.x, box.x);
            this.y = Math.min(this.y, box.y);
            x2 = Math.max(x2, box.x + box.size_x);
            y2 = Math.max(y2, box.y + box.size_y);
        }
        this.size_x = x2 - this.x;
        this.size_y = y2 - this.y;
        this.small_boxes = small_boxes;
    }

    check_recognized(){
        for (let index = 0; index < this.small_boxes.length; index++) {
            const box = this.small_boxes[index];
            box.recognized_count += 1;
        }
    }
}

class ImageTable{
    constructor(cluster_center, small_box_count = 20, small_box_in_big = 5){
        this.small_box_count = small_box_count;
        this.small_box_in_big = small_box_in_big;
        
        this.width = 224;
        this.height = 224;

        this.image = undefined;
        
        this.cluster_center = cluster_center;
        
        const max_dim = Math.max(this.width, this.height);
        this.step = Math.floor(max_dim / small_box_count);
        
        this.cells = this.build_small_cells();
        this.big_boxes = this.build_big_boxes();
    }

    build_small_cells(){
        let cur_y = 0;
        
        const cells = [];
        while (cur_y < this.height) {
            let cur_x = 0;
            const current_row = [];
            let cur_cell_in_row = 0;
            while (cur_x < this.width){
                cur_cell_in_row += 1;
                if(cur_x + this.step > this.width && cur_y + this.step > this.height){
                    cells[cells.length - 1][cells[0].length - 1].size_x = this.width - cells[cells.length - 1][cells[0].length - 1].x;
                    cells[cells.length - 1][cells[0].length - 1].size_y = this.height - cells[cells.length - 1][cells[0].length - 1].y;
                    break;
                }
                    
                if(cur_x + this.step > this.width){
                    current_row[current_row.length - 1].size_x = this.width - current_row[current_row.length - 1].x;
                    break;
                }
                
                if(cur_y + this.step > this.height){
                    cells[cells.length - 1][cur_cell_in_row - 1].size_y = this.height - cells[cells.length - 1][cur_cell_in_row - 1].y;
                    cur_x += this.step;
                    continue;
                }
                
                current_row.push(new Cell(cur_x, cur_y, this.step, this.step));
                cur_x += this.step;
            }
            cur_y += this.step;
            if(current_row.length > 0){
                cells.push(current_row);
            }
        }
        return cells;
    }

    build_big_boxes(){
        const big_boxes = [];
        for (let y = 0; y < this.cells.length + 1 - this.small_box_in_big; y++) {
            for (let x = 0; x < this.cells[y].length + 1 - this.small_box_in_big; x++) {
                const bix_box_cells = [];
                for (let y1 = 0; y1 < this.small_box_in_big; y1++) {
                    for (let x1 = 0; x1 < this.small_box_in_big; x1++) {
                        bix_box_cells.push(this.cells[y + y1][x + x1])
                    }
                }
                big_boxes.push(new BigBox(bix_box_cells));
            }
        }
        return big_boxes;
    }

    clear_recognized(){
        for (let index = 0; index < this.cells.length; index++) {
            const row = this.cells[index];
            for (let index = 0; index < row.length; index++) {
                const box = row[index];
                box.recognized_count = 0;
            }
        }
    }

    similarity_algo(cropped_features, similarity){
        this.clear_recognized();
        const similarities = cosine_similarity(cropped_features, this.cluster_center);
        let check = 0;
        for (let index = 0; index < this.big_boxes.length; index++) {
            const box = this.big_boxes[index];
            if(similarities[index] > similarity){
                check++;
                box.check_recognized();
            }
        }
    }

    get_crop_bbox(cropped_features, level, similarity){
        this.similarity_algo(cropped_features, similarity);
        
        let tl_x = -1;
        let tl_y = -1;
        let br_x = -1;
        let br_y = -1;
        
        for (let index = 0; index < this.cells.length; index++) {
            const row = this.cells[index];
            for (let index = 0; index < row.length; index++) {
                const box = row[index];
                if(box.recognized_count >= level){
                    ({tl_x, tl_y, br_x, br_y} = box.union(tl_x, tl_y, br_x, br_y));
                }
            }
        }

        tl_x = Math.max(tl_x, 0);
        tl_y = Math.max(tl_y, 0);
        br_x = br_x !== -1 ? br_x : this.width;
        br_y = br_y !== -1 ? br_y : this.height;
        return {tl_x, tl_y, br_x, br_y};
    }

    calc_and_draw_box(image_buffer, cropped_features, level, similarity){
        return new Promise(async (resolve, reject) => {
            this.clear_recognized();
            this.image = await Image.load(image_buffer);
            let {tl_x, tl_y, br_x, br_y} = this.get_crop_bbox(cropped_features, level, similarity);
            console.log({tl_x, tl_y, br_x, br_y});
            ({tl_x, tl_y, br_x, br_y} = recrop(tl_x, tl_y, br_x, br_y, this.width, this.height, this.image.width, this.image.height));
            this.image = this.image.paintPolyline([[tl_x, tl_y],[tl_x, br_y],[br_x, br_y],[br_x, tl_y]], {closed: true});
            resolve(this.image.toDataURL());
        });
    }
}

export {ImageTable}