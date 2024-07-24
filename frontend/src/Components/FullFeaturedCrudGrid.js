import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';

import './FullFeaturedCrudGrid.css';


import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';


function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;
  

  const handleClick = () => {
    const newId = Math.floor(Math.random() * 10000) +  Math.floor(Date.now() / 1000);
    const newRow = { id: newId, name: '', description: '', priority: 'Low', daysRemaining: '', isNew: true };
    
    setRows((oldRows) => [...oldRows, newRow]);
     setRowModesModel((oldModel) => ({
       ...oldModel,
       [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
     }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [checked, setChecked] = React.useState({});
  
  const handleChange = (id) => (event) => {
    setChecked((prev) => ({ ...prev, [id]: event.target.checked }));
        // Call handleDeleteClick here if needed
        handleDeleteClick(id)();
    };


  
  const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
  };

  const getActions = ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        return isInEditMode
            ? [
                <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    sx={{ color: 'primary.main' }}
                    onClick={() => handleSaveClick(id)}
                />,
                <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                />,
            ]
            : [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={
                        <Checkbox
                        checked={checked[id] || false}
                        onChange={handleChange(id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                    label="Delete"
                    onClick={handleChange(id)}
                    color="inherit"
                />
            ];
    };


    const columns = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: getActions,
        },
        { field: 'name', headerName: 'Task Name', width: 180, editable: true },
        { field: 'description', headerName: 'Description', width: 180, editable: true },
        { field: 'priority', headerName: 'Priority', width: 180, type: 'singleSelect',
        valueOptions: ['Low', 'Medium', 'High'],editable: true },
        { field: 'daysRemaining', headerName: 'No. of Days remaining', width: 180, editable: true },
    ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/v1/tasks');
        console.log(response.data)
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      //yes
      event.defaultMuiPrevented = true;
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }

    
  };

  const handleEditClick = (id) => () => {
    
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = async (id) => {
    const row = rows.find((row) => row.id === id);
    const newOrUpdatedTask = row.isNew;
    const updatedRow = await processRowUpdate(row);
    setRows((prevRows) => {
    return prevRows.map((r) => (r.id === updatedRow.id ? updatedRow : r));
  });

    setRowModesModel((prevModel) => ({
        ...prevModel,
        [updatedRow.id]: { mode: GridRowModes.View },
    }));
    
  };


  const handleDeleteClick = (id) => async () => {
    try {
        console.log("triggers delete 1");
        await axios.delete(`http://localhost:5001/api/v1/tasks/${id}`);
        setRows(rows.filter((row) => row.id !== id));
      } catch (error) {
        console.error('Error deleting row:', error);
      }
  };

  const processRowUpdate = async (updatedRow) => {
    try {
      if (updatedRow.isNew) {
        const rowToSend = { ...updatedRow, daysRemaining: parseInt(updatedRow.daysRemaining, 10), isNew: false };
        const response = await axios.post('http://localhost:5001/api/v1/tasks', rowToSend);
        setRows([...rows.filter((row) => row.id !== updatedRow.id), updatedRow]);
        setRowModesModel({ ...rowModesModel, [updatedRow.id]: { mode: GridRowModes.View } });

        return response.data;
      } else {
        const response = await axios.put(`http://localhost:5001/api/v1/tasks/${updatedRow.id}`, updatedRow);
        setRows([...rows.filter((row) => row.id !== updatedRow.id), updatedRow]);
        setRowModesModel({ ...rowModesModel, [updatedRow.id]: { mode: GridRowModes.View } });
        return response.data;
      }
      
    } catch (error) {
      console.error('Error updating row:', error);
      return updatedRow;
    }
  };

  const handleProcessRowUpdateError = (error) => {
    console.error('Error processing row update:', error);
  };

  return (
    <Box className="boxStyle">
        <DataGrid
        sx={{}}
        className="innerTable"
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
        toolbar: EditToolbar,
        }}
        slotProps={{
        toolbar: { setRows, setRowModesModel },
        }}
        />
    </Box>
  );
}
