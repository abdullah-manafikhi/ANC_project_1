import { useState, useRef, useEffect, useContext } from 'react';
import { BiTrash, BiEditAlt, BiCross, BiTv } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import TableContext from '../context/TableContext.js.jsx';
import { PopOver } from '../colorPallete/PopOver'
import AddLine from '../AddLine.jsx';
import { gsap } from "gsap";

function SortableItemTest(props) {

    const senceGsap = useRef()
    const compGsap = useRef()
    // console.log( document.querySelector('body'))

    // useEffect(() => {
    //     let ctx = gsap.context(() => {
    //         gsap.from(senceGsap.current, {  y: -10 ,duration :1,delay: 0.5});
    //         gsap.from('span', 5, {
    //             x: -100,
    //             ease: "power1.inOut",
    //             delay: 0,//make del by id
    //             stagger: {
    //               amount: .5, 
    //               grid: "auto",
    //               axis: "y",
    //               from: "end"
    //             }
    //           });
    //       }, compGsap)
    //       return () => ctx.revert();
    // }, [])


    // this is the table line "row" data
    const [formData, setFormData] = useState(props.line)
    const [inputDisabled, setInputDisabled] = useState(true)
    // For coloring lines depending on camera column value and days lines
    const [style4, setStyle4] = useState(props.style4)

    // getting the table from the context
    const { cursor, adding, setAdding } = useContext(TableContext)
    // This for focusing on the scene input when updateing start
    const firstInputRef = useRef()

    const styleSummary = useRef()

    useEffect(() => {
        setStyle4(props.style4)
    }, [props.style4])

    useEffect(() => {
        setTimeout(() => {
            const trgt = [...document.querySelectorAll("textarea")]
            trgt.forEach(element => {
                element.style.height = "auto";
                element.style.height = trgt.scrollHeight + "px";
            });
        }, 1000);

    }, [inputDisabled])

    // This function is reponsible for allowing the user to save the edits that he/she made is on the row 
    const saveIconHundler = (e) => {
        window.alert("you edit the sence number (XX) saved ")
        setInputDisabled(prevState => {
            return true
        })
    }

    const cancelIconHundler = (e) => {
        setInputDisabled(prevState => {
            console.log(prevState)
            return true
        })
    }

    // This function is reponsible for allowing the user to edit the row, focusing on the first input and highliting its text 
    const onEditClick = (e) => {
        setInputDisabled(prevState => {
            if (prevState) {
                if (firstInputRef.current !== null) {
                    setTimeout(() => {
                        firstInputRef.current.focus(); // onEditClick => focus=> showing problem on click  on day or note becuase there is no text area 
                        firstInputRef.current.setSelectionRange(0, firstInputRef.current.value.length);
                    }, 0);
                }
            }
            return !prevState
        })
    }

    // This is for keeping the textarea's height equal to the value's height 
    // and avoiding the scroll bar inside the textarea 
    const onChange = (e) => {
        const trgt = e.currentTarget
        trgt.style.height = "auto";
        trgt.style.height = trgt.scrollHeight + "px";
        setFormData(prevState => ({ ...prevState, [trgt.id]: trgt.value }))
    }


    return (
        <>
            {  // ========== DAYS LINES ===========
                (props.line.day) ? (
                    <>
                        <div title="Hold to Drag!" style={style4.DAYS} className={`row-grid-day touch-manipulation z-1 ${cursor} `}>
                            <span className=' w-auto noprintdplay m-auto flex justify-evenly'>
                                {inputDisabled ?
                                    <>
                                        <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => onEditClick(e)}><BiEditAlt /></button>
                                        <label className='z-50 btn btn-xs btn-ghost text-red-600' htmlFor={`my-modal-${formData.id}`} onClick={() => console.log("dleete")}><BiTrash /></label>
                                    </> :
                                    <>
                                        <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => saveIconHundler(e)}>save</button>
                                        <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => cancelIconHundler(e)}>cancel</button>
                                    </>}
                            </span>
                            <span className='my-auto'>
                                {/* Normal mode display the span when ediing display the input */}
                                <input
                                    onChange={e => onChange(e)} id="day"
                                    type="text" placeholder="" defaultValue={`Day ${formData.day}`} ref={firstInputRef}
                                    className={`input input-ghost text-center resize-none w-full font-extrabold max-w-xs scroll-day ${inputDisabled ? "pointer-events-none hidden" : "pointer-events-auto"}`}
                                />
                                <span className={`${inputDisabled ? "" : "hidden"}  font-extrabold`}>{formData.day}</span>
                            </span>
                            <div className={`flex w-full justify-center`}>
                                {adding.isAdding ? (<button className='btn btn-xs btn-ghost text-blue-500 text-xl my-auto '>
                                    <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                                </button>) : ""}
                            </div>
                        </div>
                        {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                    </>
                )
                    // ========== NOTES LINES ===========
                    : (props.line.note) ? (
                        <>
                            <div title="Hold to Drag!" className={`row-grid-note touch-manipulation z-1 ${cursor}`}>
                                <span className='w-auto noprintdplay m-auto flex justify-evenly'>
                                    {/* inputDisable ?  *** ENOUGH *** */}
                                    {inputDisabled === true ?
                                        <>
                                            <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => onEditClick(e)}><BiEditAlt /></button>
                                            <label className='z-50 btn btn-xs btn-ghost text-red-600' htmlFor={`my-modal-${formData.id}`} onClick={() => console.log("dleete")}><BiTrash /></label>
                                        </> :
                                        <>
                                            <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => saveIconHundler(e)}>save</button>
                                            <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => cancelIconHundler(e)}>cancel</button>
                                        </>}
                                </span>
                                <span className='my-auto'>
                                    {/* Normal mode display the span when editing displays the input */}
                                    <input
                                        onChange={e => onChange(e)} id="1656"
                                        type="text" placeholder="" defaultValue={formData.note} ref={firstInputRef}
                                        className={`input input-ghost text-center resize-none w-full font-extrabold max-w-xs scroll-day ${inputDisabled ? "pointer-events-none hidden" : "pointer-events-auto"}`}
                                    />
                                    <span className={`${inputDisabled ? "" : "hidden"} scroll-day font-extrabold`}>{formData.note}</span>
                                </span>
                                <span className=" w-full flex justify-end">
                                    {
                                        adding.isAdding ? (
                                            <button className='btn btn-xs btn-ghost text-blue-500 text-xl my-auto'>
                                                <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                                            </button>) : ""
                                    }
                                </span>
                            </div>
                            {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                        </>
                    )
                         // =========== SCENE LINES ===========
                        : (
                            <>
                                <div className='gsappp' ref={compGsap} >
                                    <div
                                        // style={formData.camera === "INT." ? style4.INT : style4.EXT}
                                        style={formData.camera === "INT." ? style4.INT : style4.EXT}
                                        title="Hold to Drag!"
                                        ref={senceGsap}
                                        className={`row-grid box touch-manipulation z-1 ${cursor}`}
                                    >
                                        <span className="w-full  noprintdplay m-auto flex">
                                            <span>
                                                {inputDisabled ? (
                                                    <>
                                                        <button className="z-50 btn btn-xs btn-ghost" onClick={(e) => onEditClick(e)}>
                                                            <BiEditAlt />
                                                        </button>
                                                        <label
                                                            className="z-50 btn btn-xs btn-ghost text-red-600"
                                                            htmlFor={`my-modal-${formData.id}`} onClick={() => console.log("dleete")}
                                                        >
                                                            <BiTrash />
                                                        </label>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="z-50 btn btn-xs btn-ghost" onClick={(e) => saveIconHundler(e)}>
                                                            save
                                                        </button>
                                                        <button className="z-50 btn btn-xs btn-ghost" onClick={(e) => cancelIconHundler(e)}>
                                                            cancel
                                                        </button>
                                                    </>
                                                )}
                                            </span>
                                        </span>
                                        <span className="my-auto">
                                            {inputDisabled ? (<><span className="text-sm ">{formData.scene}</span></>) : (
                                                <>
                                                    <textarea
                                                        onChange={(e) => onChange(e)}
                                                        id="scene"
                                                        type="text"
                                                        placeholder=""
                                                        defaultValue={formData.scene}
                                                        ref={firstInputRef}
                                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                            ? "pointer-events-none"
                                                            : "pointer-events-auto"
                                                            }`}
                                                    />
                                                </>
                                            )}
                                        </span>
                                        <span className="my-auto">
                                            {inputDisabled ? (<><span className="text-sm ">{formData.camera}</span></>) : (
                                                <>
                                                    <textarea
                                                        onChange={(e) => onChange(e)}
                                                        id="camera"
                                                        type="text"
                                                        placeholder=""
                                                        defaultValue={formData.camera}
                                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                            ? "pointer-events-none"
                                                            : "pointer-events-auto"
                                                            }`}
                                                    />
                                                </>
                                            )}
                                        </span>
                                        <span className="my-auto">
                                            {inputDisabled ? (<><span className="text-sm ">{formData.summary}</span> </>) : (
                                                <>
                                                    <textarea
                                                        ref={styleSummary}
                                                        onChange={(e) => onChange(e)}
                                                        id="summary"
                                                        type="text"
                                                        placeholder=""
                                                        defaultValue={formData.summary}
                                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                            ? "pointer-events-none"
                                                            : "pointer-events-auto"
                                                            }`}
                                                    />
                                                </>
                                            )}
                                        </span>
                                        <span className="my-auto">
                                            {inputDisabled ? (<><span className="text-sm">{formData.location}</span> </>) : (
                                                <>
                                                    <textarea
                                                        onChange={(e) => onChange(e)}
                                                        id="location"
                                                        type="text"
                                                        placeholder=""
                                                        defaultValue={formData.location}
                                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                            ? "pointer-events-none"
                                                            : "pointer-events-auto"
                                                            }`}
                                                    />
                                                </>
                                            )}
                                        </span>
                                        <span className="my-auto w-full flex justify-end">
                                            {inputDisabled ? (<><span className="text-sm ">{formData.page_length}</span> </>) : (
                                                <>
                                                    <textarea
                                                        onChange={(e) => onChange(e)}
                                                        id="page_length"
                                                        type="text"
                                                        placeholder=""
                                                        defaultValue={formData.page_length}
                                                        className={
                                                            `textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll 
                                                ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`
                                                        }
                                                    />
                                                </>
                                            )}
                                            {adding.isAdding ? (
                                                <button className="btn btn-xs btn-ghost text-blue-500 text-xl my-auto">
                                                    <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                                                </button>) : ("")}
                                        </span>
                                    </div>
                                    {/* this is the module that will display the delete confirm when clicking on the delete button*/}
                                    {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                                </div>
                            </>
                        )
            }

            {/* =================================== DELETE MODAL ====================================== */}
            <input type="checkbox" id={`my-modal-${formData.id}`} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <p className="py-4">Are you sure you want to delete <strong>{formData.scene || formData.day || formData.note}</strong>!</p>
                    <div className="modal-action">
                        <label htmlFor={`my-modal-${formData.id}`} className="btn btn-ghost">Cancel</label>
                        <label htmlFor={`my-modal-${formData.id}`} className="btn bg-red-500 border-none">Delete</label>
                    </div>
                </div>
            </div>
        </>
    )

}

export default SortableItemTest