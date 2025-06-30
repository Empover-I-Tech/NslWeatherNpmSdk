import { useSelector } from "react-redux";

export const Colors = {
    app_theme_color: "#ED3237",
    white_color: "#FFFFFF",
    black_color: "#000000",
    lightish_grey: '#C2BDBD',
    lightgrey: '#F2F2F2',
    lighy_black:"#00000099",
    yellow_rgba:"rgba(255, 181, 1, 1)",
    transparent:"rgba(0,0,0,0.5)",
    Crimson_Red:"#ED32370F",
    white_rgba:"rgba(242, 246, 249, 1)",
    green:"#0CB500"
}

export const useColors = () => {
    const companyDetails = useSelector(state => state.userData.companyDetails);
    return {
        app_theme_color: companyDetails?.primaryColor || '#ED3237',
        textColor: companyDetails?.textColor || '#000000',
        secondaryColor: companyDetails?.secondaryColor || '#FFFFFF',
        lightish_grey: '#C2BDBD',
        lightgrey: '#F2F2F2',
        white_color: "#FFFFFF",
        black_color: "#000000",
        yellow_rgba:"rgba(255, 181, 1, 1)",
        lighy_black:"#00000099",
        transparent: "rgba(0,0,0,0.5)",
        Crimson_Red: "#ED32370F",
        white_rgba:"rgba(242, 246, 249, 1)",
        green:"#0CB500"
    }
}