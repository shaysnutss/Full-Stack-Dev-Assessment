import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';


function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = async () => {
    const randomId = () => '_' + Math.random().toString(36).substr(2, 9);
    const newRow = { id: randomId(), name: '', priority: '', employeeName: '', isNew: true };

    try {
        const response = await axios.post('/api/rows', newRow);
        setRows((oldRows) => [...(oldRows || []), response.data]);
        setRowModesModel((oldModel) => ({
                ...(oldModel || {}),
                [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));
    } catch (error) {
      console.error('Error adding row:', error);
    }
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
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

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
                    onClick={() => handleCancelClick(id)}
                    color="inherit"
                />,
            ]
            : [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={() => handleEditClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => processRowUpdate(id)}
                    color="inherit"
                />,
            ];
    };

    const columns = [
        { field: 'name', headerName: 'Task Name', width: 180, editable: true },
        { field: 'priority', headerName: 'Priority', width: 80, editable: true },
        { field: 'employeeName', headerName: 'Employee Name', width: 180, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: getActions,
        },
    ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/rows');
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
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

  const processRowUpdate = async (updatedRow, originalRow) => {
  if (updatedRow._action === 'delete') {
    // Handle row deletion
    try {
      await axios.delete(`/api/rows/${updatedRow.id}`); // Send delete request
      return { ...updatedRow, _action: 'delete' }; // Mark the row for deletion
    } catch (error) {
      console.error('Error deleting row:', error);
      return originalRow; // Revert to the original row if deletion fails
    }
  }

  // Handle row update
  try {
    const response = await axios.put(`/api/rows/${updatedRow.id}`, updatedRow); // Send update request
    return response.data; // Return updated row data
  } catch (error) {
    console.error('Error updating row:', error);
    return originalRow; // Revert to the original row if update fails
  }
};

  const handleProcessRowUpdateError = (error) => {
    console.error('Error processing row update:', error);
  };

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
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
