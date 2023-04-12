import { useState, useRef, useEffect, useContext } from "react";
import { PropTypes } from "prop-types";
import TableContext from './context/TableContext.js';
import SortableItemTest from "./SortableItemTest";
import { gsap } from "gsap";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from 'react-window';


function DragTest({ items, style }) {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [touch, setTouch] = useState(false)

    const { setCursor, daysMap, setDaysMap, addLine } = useContext(TableContext);

    useEffect(() => {
        setData(items)
    }, [items])

    // useEffect(() => {
    //     console.log(document.querySelectorAll('.gsappp'))
    //     const target = document.querySelectorAll('.gsappp')



    //     let ctx = gsap.context(() => {

    //         // gsap.from(senceGsap.current, {  y: -10 ,duration :1,delay: 0.5});

    //         gsap.from(target, 5, {
    //             x: -100,
    //             ease: "power1.inOut",
    //             delay: 1,//make del by id
    //             stagger: {
    //                 amount: 1.5,
    //                 grid: "auto",
    //                 axis: "y",
    //                 from: "end"
    //             }
    //         });

    //     }, document.querySelector('#container'))

    //     return () => ctx.revert();

    // }, [])



    // ========= USERREFs =========
    const dragItem = useRef(null);
    // the line that the pointer is over it after dragging a line
    const dragOverItem = useRef(null);

    useEffect(() => {
        if (addLine.type) {
            let newItems = data.slice(0, addLine.index + 1)
            newItems.push({ id: data.length, [addLine.type]: "New" })
            const test = data.slice(addLine.index + 1, data.length - 1)
            newItems = newItems.concat(test)
            setData(newItems)
        }
    }, [addLine])

    useEffect(() => {
        // initializing global variable "days"
        globalThis.days = {
            colors: {},
            data: []
        }
        if (data.length > 0) {
            data.forEach((item, index) => {
                // This condition is for checking if the item is a day item
                if (Object.hasOwn(item, "day")) {
                    (days.data).push({ ...item, index: index })
                    // This condition is to check if the user had changed a day color 
                    if (localStorage.getItem("colors") && (JSON.parse(localStorage.getItem("colors")))[index] !== "white") {
                        days.colors = { ...days.colors, [item.id]: (JSON.parse(localStorage.getItem("colors")))[item.id] }
                    }
                    else {
                        days.colors = { ...days.colors, [item.id]: "white" }
                    }
                }
                // We are stringifying days object because we cannot save object in localStorge
            })
            localStorage.setItem("colors", JSON.stringify(days.colors))
            setDaysMap(days)
        }
    }, [data])


    // ===========================================
    // *************** MOUSE EVENTS **************
    // ===========================================

    let x = null
    let dragFlag = false

    const onDragStart = (e, index) => {
        e.currentTarget.classList.add("hello")
        x = setTimeout(() => {
            dragFlag = true
            e.target.classList.add("dragging")
            dragItem.current = { data: data[index], index: index };
            // getting all the lines
            globalThis.lines = [...document.querySelectorAll(".draggable-line")];
            // creating array of objects that cotains the folowing info
            globalThis.heights = lines.map((line, index) => {
                let rec = line.getBoundingClientRect();
                return { id: line.id, index: index, Y: rec.height + rec.top };
            });
        }, 300)
    };

    const onDragEnter = (e, index) => {
        dragOverItem.current = { data: data[index], index: index };
        if (dragFlag) {
            e.preventDefault();
            // after dragging a line when entering new line add "dragging class"
            e.currentTarget.classList.add("dragging");
        }
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        if (dragFlag) {
            // after dragging a line when leaving an enteed line remove "dragging class"
            e.currentTarget.classList.remove("dragging");
        }

    };

    const onDragEnd = (e) => {
        if (dragFlag) {
            e.preventDefault();
            const test = [...data];
            test.splice(dragItem.current.index, 1);
            // Adding item to the array
            test.splice(dragOverItem.current.index, 0, dragItem.current.data);
            dragItem.current = {
                ...dragItem.current,
                index: dragOverItem.current.index,
            };
            setRefresh((prev) => !prev);
            setData(test);
        }
        else {
            clearTimeout(x)
            dragItem.current = null
        }
        const draggings = [...document.querySelectorAll(".dragging")]
        draggings.forEach(dragging => {
            dragging.classList.remove("dragging")
        })
        clearTimeout(x)
    };




    // ===========================================
    // *************** TOUCH EVENTS **************
    // ===========================================


    let y = null
    const pointerDown = (e, index) => {
        // e.preventDefault()
        if (e.pointerType !== "mouse") {
            y = setTimeout(() => {
                dragFlag = true
                e.target.classList.add("dragging")
                dragItem.current = { data: data[index], index: index };
                // getting all the lines
                setTouch(true)
            }, 300)
        }
    }

    const pointerMove = (e, index) => {
        if (e.pointerType !== "mouse") {
            if (dragFlag) {
                e.currentTarget.style.position = "fixed"
                e.currentTarget.style.width = "80%"
                e.currentTarget.style.top = `${e.clientY}px`
                e.currentTarget.style.zIndex = `+1000`
                if (e.clientY > window.innerHeight * 0.9) {
                    window.scrollBy(0, 15)
                }
                if (e.clientY < window.innerHeight * 0.1) {
                    window.scrollBy(0, -15)
                }
            }
        }
    }

    const pointerUp = (e, index) => {
        e.preventDefault()
        if (e.pointerType !== "mouse") {
            e.currentTarget.style.position = "relative"
            e.currentTarget.style.width = "100%"
            e.currentTarget.style.top = "0px"
            if (dragFlag) {
                globalThis.lines = [...document.querySelectorAll(".draggable-line")];
                // creating array of objects that cotains the folowing info
                globalThis.heights = lines.map((line, indx) => {
                    let rec = line.getBoundingClientRect();
                    return { id: line.id, index: indx, Y: indx === index ? 0 : rec.height + rec.top };
                });
                const current = heights.find((line) => { return (e.clientY) - (line.Y) < -10 });
                dragOverItem.current = { data: data[current.index], index: current.index }
                if (dragOverItem.current.data) {
                    const test = [...data];
                    test.splice(Number(dragItem.current.index), 1);
                    // Adding item to the array
                    test.splice(dragOverItem.current.index, 0, dragItem.current.data);
                    dragItem.current = {
                        ...dragItem.current,
                        index: dragOverItem.current.index,
                    };
                    setData(test);
                    setRefresh((prev) => !prev);
                    dragItem.current = null
                }
            }
            clearTimeout(y)
            setTouch(false)
            dragFlag = false
            dragItem.current = null
        };

    }

    const onPointerCancel = (e) => {
        if (e.pointerType !== "mouse") {
            if (dragItem.current === null) {
                clearTimeout(x)
                clearTimeout(y)
                dragItem.current = null
                dragFlag = false
            }
        }
    }

    return (
        <div
            id="container"
            className={`w-full gap-y-0.5 grid grid-cols-1 ${touch ? " touch-none" : "touch-manipulation "} text-black `}
        >
            {data.map((line, index) => (
                <div
                    draggable
                    key={index}
                    id={line.id}
                    className={`w-full cursor-move draggable transition-transform touch-none draggable-line`}
                    // className={`w-full cursor-move draggable transition-transform draggable-line`}
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => onDragEnter(e, index)}
                    onDragLeave={(e) => onDragLeave(e, index)}
                    onDragEnd={(e) => onDragEnd(e, index)}

                    onPointerDown={(e) => pointerDown(e, index)}
                    onPointerMove={(e) => pointerMove(e, index)}
                    onPointerUp={(e) => pointerUp(e, index)}
                    onPointerCancel={(e) => { onPointerCancel(e) }}
                >
                    <SortableItemTest
                        key={line.id}
                        index={index}
                        id={line.id}
                        line={line}
                        style4={style}
                        value={`Item ${line.id}`}
                    />
                </div>
            ))}
        </div>
    );
}

DragTest.defaultProps = {
    data: [],
};

DragTest.propTypes = {
    data: PropTypes.array,
};

export default DragTest;
