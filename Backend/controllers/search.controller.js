import { fetchFromTMDB } from "../services/tmdb.service.js";
import {User} from "../models/user.model.js";

export const searchPerson = async (req,res)=>{
    const {query} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}}&include_adult=false&language=en-US&page=1`)
        
        
        if(data.results.length === 0){
          return res.status(400).send(null);
        }

        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:[{
                    id:data.results[0].id,
                    image: data.results[0].profile_path,
                    title: data.results[0].name,
                    searchType: "person",
                    createdAt: new Date()
                }]
            }
        })

        return res.status(200).json({success:true, content:data.results});

    } catch (error) {
        console.log("Error in search controller: ", error.message);
        
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export const searchMovie = async (req,res)=>{
    const {query} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}}&include_adult=false&language=en-US&page=1`)
        
        if(data.results.length === 0){
            return res.status(400).send(null);
          }
          await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:[{
                    id:data.results[0].id,
                    image: data.results[0].poster_path,
                    title: data.results[0].title,
                    searchType: "movie",
                    createdAt: new Date()
                }]
            }
        })
        return res.status(200).json({success:true, content:data.results});
        
    } catch (error) {
        console.log("Error in search movie controller: ", error.message);
        
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
}


export const searchTv = async (req,res)=>{
    const { query } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}}&include_adult=false&language=en-US&page=1`)
        
        if(data.results.length === 0){
            return res.status(400).send(null);
          }
          await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:[{
                    id:data.results[0].id,
                    image: data.results[0].poster_path,
                    title: data.results[0].name,
                    searchType: "tv",
                    createdAt: new Date()
                }]
            }
        })

        return res.status(200).json({success:true, content:data.results});

    } catch (error) {
        console.log("Error in search tv controller: ", error.message);
        
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export const getSearchHistory = async (req, res)=>{
    try {
        res.status(200).json({success:true, content:req.user.searchHistory})
    } catch (error) {
        res.status(500).json({sucess:false, message: "Internal Server Error"})
    }
}

export const removeItemFromSearchHistory = async (req, res)=>{
    let {id} = req.params;
     id = parseInt(id);
    console.log(typeof(id));
    
    try {
       const user = await User.findById(req.user._id);

       if(!user){
        return res.status(404).json({success:false, message:"User not found"})
       }
        
       const flatSearchHistory = user.searchHistory.flat();

       const updatedSearchHistory = flatSearchHistory.filter((history) => history.id !== id);

       user.searchHistory = updatedSearchHistory;
       await user.save();
       
        res.status(200).json({success:true, message:"Item removed from search history"})
    } catch (error) {
        console.log("Error in remove history controller: ", error.message);
        
        res.status(404).json({success:true, message:"Internal Server Error"})
        
    }
}