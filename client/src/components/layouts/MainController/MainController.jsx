import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Navbar from '../../globals/navbar/Navbar';
import Calender from '../../layouts/calender/Calender';
import Employees from '../../layouts/employees/Employees';
import CustomModal from '../../globals/modal/CustomModal';
import AddEmployeeForm from './parts/AddEmployeeForm';
import ShiftSettingsForm from './parts/ShiftSettingsForm';

const MainController = () => {

    const [activeModal, setActiveModal] = useState(false);

    return (
        <div className="main-controller">
            <CustomModal
                active={activeModal}
                cancelModal={setActiveModal.bind(null, false)}
            >
                <div className="main-controller__settings">
                    <section>
                        {activeModal ?
                            <ShiftSettingsForm active={activeModal} />
                            :
                            null
                        }
                    </section>
                </div>
            </CustomModal>

            <Navbar
                toggleSettingsModal={setActiveModal.bind(null, !activeModal)}
            />
            <div className="main-controller__content">
                <DragDropContext>
                    <Calender />
                    <Employees />
                </DragDropContext>
            </div>
        </div>
    )
}

export default MainController;
