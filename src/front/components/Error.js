import React from 'react'

export default function Error(props) {
    return (
        <div>
            <p>Ooops, we encountered an error: </p>
            {props.message}
        </div>
    )
}
