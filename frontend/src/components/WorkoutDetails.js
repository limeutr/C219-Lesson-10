import { useState } from "react"; 
import { useWorkoutContext } from "../hooks/useWorkoutsContext" 
  
//date-fns 
import formatDistanceToNow from "date-fns/formatDistanceToNow" 
  
const WorkoutDetails = ({workout}) => { 
    const { dispatch } = useWorkoutContext() 
  
    const [isEditing, setIsEditing] = useState(false); 
    const [updatedTitle, setUpdatedTitle] = useState(workout.title); 
    const [updatedLoad, setUpdatedLoad] = useState(workout.load); 
    const [updatedReps, setUpdatedReps] = useState(workout.reps); 
  
    const handleDelete = async () => { 
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, { 
            method: 'DELETE' 
        }) 
        const json = await response.json() 
  
        if (response.ok) { 
            dispatch({type: 'DELETE_WORKOUT', payload:json}) 
        } 
    } 
  
    const handleUpdate = async (e) => { 
        // e.preventDefault(); 
        const updatedWorkout = { 
            title: updatedTitle, 
            load: updatedLoad, 
            reps: updatedReps, 
        }; 
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, { 
            method: 'PATCH', // Ensure your backend supports PUT 
            headers: { 
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify(updatedWorkout), 
        }); 
        const json = await response.json(); 
  
        if (response.ok) { 
            dispatch({ type: 'UPDATE_WORKOUT', payload: json }); 
            setIsEditing(false); // Close the form after a successful update 
        }else { 
            console.error('Update failed:', json.error); 
        } 
    }; 
  
    return( 
        <div className="workout-details"> 
            {isEditing ? ( 
                <form onSubmit={handleUpdate} className="edit-form"> 
                    <input 
                        type="text" 
                        value={updatedTitle} 
                        onChange={(e) => setUpdatedTitle(e.target.value)} 
                    /> 
                    <input 
                        type="number" 
                        value={updatedLoad} 
                        onChange={(e) => setUpdatedLoad(e.target.value)} 
                    /> 
                    <input 
                        type="number" 
                        value={updatedReps} 
                        onChange={(e) => setUpdatedReps(e.target.value)} 
                    /> 
                    <button type="submit" onClick={(console.log("Edit Saved"))} >Save</button> 
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button> 
                </form> 
            ) : ( 
                <> 
                    <h4>{workout.title}</h4> 
                    <p><strong>Load (kg): </strong>{workout.load}</p> 
                    <p><strong>Reps: </strong>{workout.reps}</p> 
                    <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p> 
                    <div className="button-container"> 
                        <span id="delete" className="material-symbols-outlined" onClick={handleDelete}>delete</span> 
                        <span id="update" className="material-symbols-outlined" onClick={() => setIsEditing(true)}>Edit</span> 
                    </div> 
                </> 
            )} 
        </div> 
    ) 
} 
 
  
export default WorkoutDetails;
