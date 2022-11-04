import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ProductionView from "./Production";
import ReviewView from "./Review";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            { value === index && children}
        </div >
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function AgentOverview() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="Agent tabs "
                >
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ProductionView />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ReviewView />
            </TabPanel>
        </div>
    );
}