import React, { useState } from 'react';
import moment from 'moment';
import SvgIcon from '@material-ui/core/SvgIcon';
//icons
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import TodayIcon from '@material-ui/icons/Today';

const Calender = () => {

    const [selectedDate, setSelectedDate] = useState(moment());
    console.log()

    return (
        <div className="calender">
            <header className="calender__header">
                <div className="calender__header__section">
                    <p>{moment(selectedDate).startOf('week').format('MMM DD')}</p>
                    <p>&nbsp;-&nbsp;</p>
                    <p>{moment(selectedDate).endOf('week').format('MMM DD')}</p>
                    <p>&nbsp;,&nbsp;</p>
                    <p>{moment(selectedDate).endOf('week').format('YYYY')}</p>
                </div>
                <div className="calender__header__section">
                    <figure>
                        <SvgIcon
                            component={NavigateBeforeIcon}
                        />
                    </figure>
                    <button>
                        <SvgIcon
                            component={TodayIcon}
                        />
                        <span>Today</span>
                    </button>
                    <figure>
                        <SvgIcon
                            component={NavigateNextIcon}
                        />
                    </figure>
                </div>
            </header>
        </div>
    )
}

export default Calender
