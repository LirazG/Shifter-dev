import React from 'react';
import moment from 'moment';
import SvgIcon from '@material-ui/core/SvgIcon';
//icons
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import TodayIcon from '@material-ui/icons/Today';

const CalenderHeader = (props) => {

    return (
        <header className="calender__header">
            <div className="calender__header__section">
                <p>{moment(props.selectedDate).startOf('week').format('MMM DD')}</p>
                <p>&nbsp;-&nbsp;</p>
                <p>{moment(props.selectedDate).endOf('week').format('MMM DD')}</p>
                <p>&nbsp;,&nbsp;</p>
                <p>{moment(props.selectedDate).endOf('week').format('YYYY')}</p>
                <p>&nbsp;&nbsp;</p>
                <p>{props.isPast ? '(Past)' : null}</p>
            </div>
            <div className="calender__header__section">
                <figure onClick={props.changeCalenderData.bind(this, moment(props.selectedDate).subtract(7, 'days'))}>
                    <SvgIcon
                        component={NavigateBeforeIcon}
                    />
                </figure>
                <button onClick={props.changeCalenderData.bind(this, moment())} >
                    <SvgIcon
                        component={TodayIcon}
                    />
                    <span>Today</span>
                </button>
                <figure onClick={props.changeCalenderData.bind(this, moment(props.selectedDate).add(7, 'days'))} >
                    <SvgIcon
                        component={NavigateNextIcon}
                    />
                </figure>
            </div>
        </header>
    )
}

export default CalenderHeader;
