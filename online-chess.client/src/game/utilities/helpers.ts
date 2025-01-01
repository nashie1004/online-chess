export function chessBoardNotation(){
    const notationRow = Array<string>(8).fill("").map((_, idx) => `${idx + 1}`).reverse();
    const notationCol = [ "a", "b", "c", "d", "e", "f", "g", "h", ]
    const chessBoardNotation: string[][] = [];

    notationRow.forEach((row, rowIdx) => {
        chessBoardNotation[rowIdx] = []

        notationCol.forEach((col, colIdx) => { //
            chessBoardNotation[rowIdx][colIdx] = (`${col}${row}`);
        })
    })

    return chessBoardNotation;
}