// A common component to render card throughout the app
// const CardLayout = (props) => {
//     return(
//         <div className={`card-container ${props.className ?? ''}`}>
//             {props.children}
//         </div>
//     )
// }

function CardLayout({children, className}){
    return <div className={`card-container ${className ?? ""}`}>{children}</div>;
}
export default CardLayout;