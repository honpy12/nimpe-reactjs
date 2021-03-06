import React, { useEffect } from 'react';
import {
    Grid,
    Button,
    makeStyles,
    FormControlLabel,
    Checkbox
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import './HealthOrganizationUnitFilter.css';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles((theme) => ({
    formControl: {
        width: '100%'
    }
}));


export default function HealthOrganizationUnitFilter(props) {

    const classes = useStyles();

    const { t } = useTranslation();

    const {
        search
    } = props;

    // const [orgType, setOrgType] = React.useState('');

    const [checking, setChecking] = React.useState(false);

    const [screening, setScreening] = React.useState(false);

    const [manage, setManage] = React.useState(false);

    const [treatment, setTreatment] = React.useState(false);

    const [confirm, setconfirm] = React.useState(false);

    // useEffect(() => {
    //     // console.log(value)
    //     var searchObject = {};
    //     // searchObject.text = this.state.keyword;
    //     searchObject.pageIndex = 0;
    //     searchObject.pageSize = 10;
    //     searchObject.orgType = orgType;
    // }, [orgType]);

    return (
        <Grid className="filter-container" container md={12} spacing={2}>
            {/* <Grid item md={4} lg={4} sm={6}>
                <Autocomplete
                    value={orgType}
                    id="orgType"
                    name="orgType"
                    onChange={(event, value) => { setOrgType(value) }}
                    options={(Constant.listOrgType ? Constant.listOrgType : []).map(option => option.value)}
                    getOptionLabel={(optionId) =>
                        (Constant.listOrgType ? Constant.listOrgType : []).filter(option => option.value === optionId)[0]?.name
                    }
                    filterSelectedOptions
                    renderInput={params => (
                        <TextField
                            className="input"
                            {...params}
                            value={orgType ? orgType : null}
                            label={<span><span style={{ color: "red" }}></span> {t("health_org.type")}</span>}
                            variant="outlined"
                            size="small"
                        />
                    )}
                />
            </Grid> */}
            <Grid item sm={10} xs={6}>
                <FormControlLabel
                    value={checking}
                    name="checking"
                    onChange={() => {
                        setChecking(!checking)
                    }}
                    control={<Checkbox checked={checking} />}
                    label="????n v??? r?? so??t"
                />
                <FormControlLabel
                    value={screening}
                    name="screening"
                    onChange={() => {
                        setScreening(!screening)
                    }}
                    control={<Checkbox checked={screening} />}
                    label="????n v??? s??ng l???c"
                />
                <FormControlLabel
                    value={manage}
                    name="manager"
                    onChange={() => {
                        setManage(!manage)
                    }}
                    control={<Checkbox checked={manage} />}
                    label="????n v??? qu???n l??"
                />
                <FormControlLabel
                    value={confirm}
                    name="confirmation"
                    onChange={() => {
                        setconfirm(!confirm)
                    }}
                    control={<Checkbox checked={confirm} />}
                    label="????n v??? kh???ng ?????nh"
                />
                <FormControlLabel
                    value={treatment}
                    name="treatment"
                    onChange={() => {
                        setTreatment(!treatment)
                    }}
                    control={<Checkbox checked={treatment} />}
                    label="????n v??? ??i???u tr???"
                />
            </Grid>

            <Grid item md={2} lg={2} sm={2}>
                <Button
                    variant="contained"
                    className="btn btn-primary-d d-inline-flex"
                    onClick={() => {
                        var searchObject = {};
                        // searchObject.orgType = orgType
                        searchObject.checking = checking
                        searchObject.screening= screening
                        searchObject.manager = manage
                        searchObject.confirmation = confirm
                        searchObject.treatment = treatment
                        // console.log(searchObject)
                        search(searchObject)
                    }}
                >
                    <SearchIcon />
                    {t("general.search")}
                </Button>
            </Grid>
        </Grid>
    );
}