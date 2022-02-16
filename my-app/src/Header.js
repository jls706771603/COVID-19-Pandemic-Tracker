import { AppBar, Toolbar, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const headersData = [
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Mandates",
        href: "/mandates",
    },
    {
        label: "Account",
        href: "/account",
    },
];


const useStyles = makeStyles ( () => ({
    header: {
        backgroundColor:  "#1F4788",
    },
    logo: {
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFFEFE",
        textAlign: "left",
    },
}));

export default function Header() {
    const { header, logo } = useStyles();

    const displayDesktop = () => {
        return <Toolbar>{ptLogo}</Toolbar>;
    };

    const ptLogo = (
        <Typography variant="h6" component="h1">
            COVID 19 Pandemic Tracker
        </Typography>
    );
  
return (
    <header>
      <AppBar className={header}>{displayDesktop()}</AppBar>
    </header>
  );
}
