/**
 * Build a small preview of a map using the preview images.
 */
function Map(map) {
    this.map = map || {};

    this.miniMap = function () {
        const $map = $('<div>').css({ width: '90px', height: '90px' });
        const board = this.map.board || '';

        for (let y = 0; y < 18; y++) {
            for (let x = 0; x < 18; x++) {
                const index = y * 18 + x;
                let imageIndex = Number(board[index]);
                if (!Number.isInteger(imageIndex) || imageIndex < 0 || imageIndex > 8) {
                    imageIndex = 0;
                }
                if (x === Number(this.map.pos_x) && y === Number(this.map.pos_y)) {
                    imageIndex = 9;
                }

                $map.append(
                    $('<img>')
                        .css({ height: '5px', width: '5px', float: 'left' })
                        .prop('src', imagesArray[imageIndex].src)
                        .attr('alt', '')
                );
            }
        }
        return $map;
    };

    const imagesArray = loadImages();

    function loadImagesArray() {
        this.length = arguments.length;
        for (let i = 0; i < arguments.length; i++) {
            this[i] = new Image(20, 20);
            this[i].src = arguments[i];
        }
    }

    function loadImages() {
        return new loadImagesArray(
            'assets/img/mini_blank.png',  // 0
            'assets/img/mini_bush.png',   // 1
            'assets/img/mini_block.png',  // 2
            'assets/img/mini_water.png',  // 3
            'assets/img/mini_stairs.png', // 4
            'assets/img/mini_key.png',    // 5
            'assets/img/mini_door.png',   // 6
            'assets/img/mini_wall.png',   // 7
            'assets/img/mini_bush.png',   // 8
            'assets/img/mini_me.png'      // 9
        );
    }
}
