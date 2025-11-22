import "./Button.css";

export default function Button(props) {
    const {
        selected = false,
        children,
        className = "",
        ...rest
    } = props;

    const classes = [
        "app-button",
        selected ? "selected" : "",
        className
    ].join(" ");

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
}
