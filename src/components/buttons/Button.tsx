'use client';

import { useState } from "react";

export interface ButtonProps {

    title: string;
    callback: () => void;
}

export default function Button (props: ButtonProps) {

    const [title, setTitle] = useState<string>(props.title);

    const onSubmit = (e: any) => {

        e.preventDefault();
        props.callback();
    }

    return (
        <div>
            <input type="submit" onClick={onSubmit} value={title} 
                className="w-full h-16 transition-all duration-700 ease-in bg-orange-600 rounded cursor-pointer hover:bg-orange-400"
            />
        </div>
    )
}