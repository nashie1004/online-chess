export function chessBoardNotation(whitesOrientation = true){
    let notationRow = Array<string>(8).fill("").map((_, idx) => `${idx + 1}`).reverse();
    let notationCol = [ "a", "b", "c", "d", "e", "f", "g", "h", ];

    if (!whitesOrientation){
        notationRow.reverse();
        notationCol.reverse();
    }

    const chessBoardNotation: string[][] = [];

    notationRow.forEach((row, rowIdx) => {
        chessBoardNotation[rowIdx] = []

        notationCol.forEach((col, colIdx) => { //
            chessBoardNotation[rowIdx][colIdx] = (`${col}${row}`);
        });
    });

    return chessBoardNotation;
}