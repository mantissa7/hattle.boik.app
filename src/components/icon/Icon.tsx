interface Props {
    path: string;
}

export default function Icon(props: Props) {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <title>Icon</title>
            <use href={`${props.path}#icon`}/>
        </svg>
    )
}