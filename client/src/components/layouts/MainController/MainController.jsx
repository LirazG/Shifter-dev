import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import moment from 'moment';
//context
import { ShiftConfigurationContext } from '../../../contexts/ShiftConfigurationContext';
import { UserDataContext } from '../../../contexts/UserDataContext';
//api
import { generalGetRequest, generalPostRequest } from '../../../functions/api';
//routes
import { FETCH_SHIFTS, DEPLOY, RE_DEPLOY } from '../../../config/routes';
//types
import { SET_SHIFTS } from '../../../reducers/shiftConfigurationReducer'
//components
import Navbar from '../../globals/navbar/Navbar';
import Calender from '../../layouts/calender/Calender';
import Employees from '../../layouts/employees/Employees';
import CustomModal from '../../globals/modal/CustomModal';
import AddEmployeeForm from './parts/AddEmployeeForm';
import ShiftSettingsForm from './parts/ShiftSettingsForm';

const MainController = () => {

    //state
    const [activeModal, setActiveModal] = useState(false);
    const [deployments, setDeployments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [draggedEmployee, setDraggedEmployee] = useState(null);
    const [draggedEmployeeIndex, setDraggedEmployeeIndex] = useState(null);
    //contexts
    const { shiftConfigsDispatch } = useContext(ShiftConfigurationContext);
    const { userData } = useContext(UserDataContext);

    //fetch shifts configs on mount
    useEffect(() => {
        (async () => {
            let shifts = await generalGetRequest(`${FETCH_SHIFTS}/?userId=${userData._id}`);
            if (shifts.status === 200)
                shiftConfigsDispatch({ type: SET_SHIFTS, payload: shifts.data });
        })();
    }, []);

    //save dragged employee to state for setting its data to the deployment object when drag ends
    const onDragStart = (dndAction) => {
        setDraggedEmployeeIndex(dndAction.source.index)
    }

    //handle user drag am employee to shift in calender
    const onDragEnd = (dndAction) => {
        // blocks unnecessary use cases for error prevention
        if (!dndAction.destination || !dndAction.source || dndAction.destination.droppableId === 'employee-list')
            return;
        if (dndAction.destination.droppableId === dndAction.source.droppableId)
            return;

        //preparing data from drag and drop onDrag function provided data
        let destinationData = dndAction.destination.droppableId.split(',');
        let sourceData = dndAction.source.droppableId.split(',');

        let destinationShiftId = destinationData[0];
        let destinationDayIndex = destinationData[1];
        let sourceDayIndex = sourceData[1];

        //select all employee ids on the same shift for comparison
        let employeesIdsArray = deployments[destinationDayIndex].filter(deployment => deployment.shiftId === destinationShiftId)
            .map(deployment => deployment.employee._id)

        // preventing re-deploy an employee from calender if already exists in new shift
        if (dndAction.source.droppableId !== 'employee-list') {
            let draggedEmployee = deployments[sourceDayIndex][dndAction.source.index].employee._id;
            if (employeesIdsArray.includes(draggedEmployee)) {
                alert('employee is already in that shift');
                return;
            }
        }

        // preventing deploy an employee from list if already exists in shift
        if (dndAction.source.droppableId === 'employee-list' && employeesIdsArray.includes(dndAction.draggableId)) {
            alert('employee is already in that shift');
            return;
        }

        //check if deployed from list or redeployed from calender and act accordingly
        if (dndAction.source.droppableId === 'employee-list') {
            handleDeployFromList(dndAction, sourceData, destinationData);
        } else {
            handleReDeploy(dndAction, sourceData, destinationData);
        }
    }

    const handleDeployFromList = async (dndAction, sourceData, destinationData) => {
        //use data passed by droppable id to set employee into place in deployments state
        // destinationData[0] - shift.id
        // destinationData[1] - day Index
        // destinationData[2] - shift index
        let shiftId = destinationData[0];
        let dayIndex = destinationData[1];
        let shiftIndex = destinationData[2];

        let oldStateCopy = JSON.parse(JSON.stringify(deployments));
        let newDeploymentsState = JSON.parse(JSON.stringify(deployments));

        //prepare body object for api call - send deployment to server
        let body = {
            userId: userData._id,
            deployDate: moment(selectedDate).add(dayIndex, 'days').toISOString(),
            employee: dndAction.draggableId,
            shiftId
        };

        //set change in state for smooth DND experience
        newDeploymentsState[dayIndex].push({ ...body, employee: draggedEmployee });
        setDeployments(newDeploymentsState);

        //send deployment to server
        let newDeploy = await generalPostRequest(DEPLOY, body);
        if (newDeploy.status !== 200) {
            //error handling and revert to old state if error occurred
            if (typeof newDeploy.data === 'string') {
                alert(newDeploy.data)
            } else {
                alert(newDeploy.data.errors.map(err => err.msg))
            }
            setDeployments(oldStateCopy)
        }
    }

    const handleReDeploy = async (dndAction, sourceData, destinationData) => {
        //use data passed by droppable id to set employee into place in deployments state
        //array[0] - shift _id
        //array[1] - day Index
        //array[2] - shift Index
        let newShiftId = destinationData[0];
        let newDayIndex = destinationData[1];
        let newIndexInDay = dndAction.destination.index;

        let oldDayIndex = sourceData[1];
        let oldIndexInDay = dndAction.source.index;

        let oldStateCopy = JSON.parse(JSON.stringify(deployments));
        let newDeploymentsState = JSON.parse(JSON.stringify(deployments));

        //update removed deploy shiftId according to drag
        newDeploymentsState[oldDayIndex][oldIndexInDay].shiftId = newShiftId;
        // remove deploy object from old place and put it the new place in state
        newDeploymentsState[newDayIndex].splice(newIndexInDay, 0, newDeploymentsState[oldDayIndex][oldIndexInDay]);
        newDeploymentsState[oldDayIndex].splice(oldIndexInDay, 1);
        setDeployments(newDeploymentsState);

        //prepare body object for api - send new deployment to server
        let body = {
            _id: dndAction.draggableId,
            deployDate: moment(selectedDate).add(newDayIndex, 'days').toISOString(),
            shiftId: newShiftId
        };

        let redeployResponse = await generalPostRequest(RE_DEPLOY, body);

        if (redeployResponse.status !== 200) {
            //error handling nad revert to old state if error occurred
            if (typeof redeployResponse.data === 'string') {
                alert(redeployResponse.data)
            } else {
                alert(redeployResponse.data.errors.map(err => err.msg))
            }
            setDeployments(oldStateCopy)
        }
    }

    return (
        <div className="main-controller">
            <CustomModal
                active={activeModal}
                cancelModal={setActiveModal.bind(null, '')}
            >
                <div className="main-controller__settings">
                    <section>
                        {activeModal === 'settings' ?
                            <ShiftSettingsForm active={activeModal === 'settings'} />
                            :
                            activeModal === 'addEmployee' ?
                                <AddEmployeeForm />
                                :
                                null
                        }
                    </section>
                </div>
            </CustomModal>

            <Navbar
                toggleSettingsModal={setActiveModal.bind(null, 'settings')}
            />
            <div className="main-controller__content">
                <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                    <Calender
                        deployments={deployments}
                        setDeployments={setDeployments}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                    <Employees
                        openAddEmployeeModal={setActiveModal.bind(null, 'addEmployee')}
                        draggedEmployeeIndex={draggedEmployeeIndex}
                        setDraggedEmployee={setDraggedEmployee}
                    />
                </DragDropContext>
            </div>
        </div>
    )
}

export default MainController;
