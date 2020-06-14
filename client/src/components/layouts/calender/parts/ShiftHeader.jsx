import React, { useState } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PeopleIcon from '@material-ui/icons/People';
import CloseIcon from '@material-ui/icons/Close';

const ShiftHeader = (props) => {

    const [active, setActive] = useState(false);

    return (
        <header className="shifts-header">
            <p>{props.name}</p>
            <SvgIcon
                component={active ? CloseIcon : InfoOutlinedIcon}
                onClick={setActive.bind(this, !active)}
            />
            <figure
                className={
                    active ?
                        "shifts-header__tooltip shifts-header__tooltip--active"
                        :
                        "shifts-header__tooltip"
                }
            >
                <div className="shifts-header__tooltip__content">
                    <section>
                        <SvgIcon
                            component={AccessTimeIcon}
                            className={props.totalShiftsNumber > 3 ?
                                "shifts-header__tooltip__content__icon--hide"
                                :
                                "shifts-header__tooltip__content__icon"
                            }
                        />
                        <p>
                            <span>Start time:</span>
                            <span>{props.startHour ? props.startHour : 'TBD'}</span>
                        </p>
                        <p>
                            <span>End time:</span>
                            <span>{props.endHour ? props.endHour : 'TBD'}</span>
                        </p>
                    </section>
                    <section>
                        <SvgIcon
                            component={PeopleIcon}
                            className={props.totalShiftsNumber > 3 ?
                                "shifts-header__tooltip__content__icon--hide"
                                :
                                "shifts-header__tooltip__content__icon"
                            }
                        />
                        <p>
                            <span>Employees:</span>
                            <span>{props.numberOfEmployees ? props.numberOfEmployees : 'TBD'}</span>
                        </p>
                    </section>
                </div>
            </figure>
        </header>
    )
}

export default ShiftHeader;
