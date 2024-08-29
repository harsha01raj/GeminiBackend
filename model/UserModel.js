const mongoose=require("mongoose");

const promptSchema=new mongoose.Schema({
    prompt:{type:String,required: [true, 'Prompt is required'],}
})

const PromptModel=mongoose.model("Prompt",promptSchema);

module.exports=PromptModel;

