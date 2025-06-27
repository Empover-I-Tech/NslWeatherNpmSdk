import { useSelector } from "react-redux";

export const Colors = {

    app_theme_color: "#ED3237",
    white_color: "#FFFFFF",
    black_color: "#000000",
    lightish_grey: '#C2BDBD',
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
    }
}