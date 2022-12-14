import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import API from '../../utils/API';


function AssignmentTable (props) {

    const [classID, setClassID] = useState()
    const [assignments, setAssignments] = useState({
        columnsAssignment: [
            { title: "Titulo", field: "title" },
            { title: "Descrição", field: "description" },
            { title: "Anexos", field: "attachments" },
        ],
        data: props.assignments.map(assignment => {
            const obj = {
                title: assignment.title,
                description: assignment.description,
                attachments: assignment.attachments
            }
            return obj
        })

    })

    useEffect(() => {
        console.log(assignments)

        setClassID(localStorage.getItem('classId'))

        
    }, [assignments, classID])

    function refreshpage() {
        window.location.reload(false)
    }

return (
    <MaterialTable
    title="Atribuições"
    columns={assignments.columnsAssignment}
    data={assignments.data}
    actions={[
        {
          icon: 'salvar',
          tooltip: 'Salvar Atribuições',
          onClick: (event, rowData) => {
              API.createAssignment(classID, rowData)
                .then(resp => {
                    console.log(resp)
                    refreshpage()
                })
                .catch(err => console.log(err))
          }
        },
    ]}
    //O código dentro dos adereços editáveis é principalmente o código da placa de caldeira fornecido pelo material-table para renderização do lado do cliente para a tabela
    editable={{
        onRowAdd: newData =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                    setAssignments(prevState => {
                        console.log(prevState)
                        const data = [...prevState.data];
                        console.log(newData)
                        data.push(newData);
                        console.log(data);
                        return { ...prevState, data }
                    });
                    console.log(assignments)
                }, 1000);
            }),
        onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                    if (oldData) {
                        setAssignments(prevState => {
                            const data = [...prevState.data];
                            data[data.indexOf(oldData)] = newData;
                            return { ...prevState, data };
                        });
                    }
                }, 600);
            }),
        onRowDelete: oldData =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                    setAssignments(prevState => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                    });
                }, 600);
            })
    }}
/>

)

}


export default AssignmentTable;