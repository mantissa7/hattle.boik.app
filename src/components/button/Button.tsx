import type { PropsWithChildren } from "react"
import './button.css';

export const Button = (props: PropsWithChildren & { type?: 'button' | 'submit'; onClick?: () => void }) => {
    return (
        <button type={props.type ?? "button"} className="btn-pushable" onClick={props.onClick}>
            <span className="btn-shadow"></span>
            <span className="btn-edge"></span>
            <span className="btn-front text">
                {props.children}
            </span>
        </button>


    )
}