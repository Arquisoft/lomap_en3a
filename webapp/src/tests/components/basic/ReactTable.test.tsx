import React from 'react';
import {render} from '@testing-library/react';
import ReactTable from "../../../components/basic/ReactTable";
import {TableBody, TableCell} from "@mui/material";


test('The table renders its cellsqq properly', () => {
    const headCells = ["First column", "Second column", "Third column"];
    const testingValues = [];
    for (let i = 0; i < 100; i++) {
        testingValues.push(i);
    }
    const tableBody = <TableBody>{testingValues.map((value, index) => (
        <TableCell>
            {value}
        </TableCell>
    ))}</TableBody>
    const {getByText} = render(<ReactTable tableName={"Table test"} headCells={headCells} tableBody={tableBody}/>)
    for (let i = 0; i < testingValues.length; i++) {
        expect(getByText(testingValues[i])).toBeInTheDocument();
    }
});