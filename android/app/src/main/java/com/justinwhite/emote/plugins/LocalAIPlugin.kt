package com.justinwhite.emote.plugins

import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@CapacitorPlugin(name = "LocalAI")
class LocalAIPlugin : Plugin() {

    private val scope = CoroutineScope(Dispatchers.Default)

    override fun load() {
        super.load()
        try {
            // Note: ML Kit GenAI is relatively new and the exact API might be 'GenerativeModel'
            // We initialize it here. It's safe to recreate or just use when called with different prompts.
            // Often ML Kit handles the underlying lifecycle.
            Log.d("LocalAIPlugin", "Local AI Plugin Loaded")
        } catch(e: Exception) {
             Log.e("LocalAIPlugin", "Error loading plugin", e)
        }
    }

    @PluginMethod
    fun generateEmotions(call: PluginCall) {
        val text = call.getString("text")
        if (text == null) {
            call.reject("Must provide text")
            return
        }

        // We launch a coroutine to avoid blocking the bridge thread
        scope.launch {
            try {
                // In a production scenario with the actual ML Kit Gen AI API:
                // We would configure the model with the system prompt and then generate content.
                // Assuming exact standard MLKit / Gemini Nano Android API class "GenerativeModel"
                
                // For now, since the actual SDK beta classes require careful setup and might fail on non-Pixel 
                // device running this emulator, we will simulate the exact JSON response shape the React app expects
                // from the AICore API execution.

                val systemPromptStr = call.getString("systemPrompt")

                val model = com.google.mlkit.genai.prompt.Generation.getClient()
                val request = com.google.mlkit.genai.prompt.GenerateContentRequest.Builder(com.google.mlkit.genai.prompt.TextPart(text)).apply {
                    if (systemPromptStr != null) {
                        promptPrefix = com.google.mlkit.genai.prompt.PromptPrefix(systemPromptStr)
                    }
                }.build()

                Log.d("LocalAIPlugin", "Sending prompt to Gemini Nano NPU on UI Thread...")
                val rawResponse = kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.Main) {
                     model.generateContent(request)
                }
                
                var responseJson = "[]"
                if (rawResponse.candidates.isNotEmpty()) {
                    responseJson = rawResponse.candidates[0].text ?: "[]"
                    
                    // The model might return conversational filler. Extract the JSON array.
                    val startIndex = responseJson.indexOf('[')
                    val endIndex = responseJson.lastIndexOf(']')
                    
                    if (startIndex != -1 && endIndex != -1 && endIndex >= startIndex) {
                        responseJson = responseJson.substring(startIndex, endIndex + 1)
                    } else {
                        // Fallback in case it returned an empty string or something else
                        responseJson = "[]"
                    }
                }

                val result = JSObject()
                result.put("result", responseJson)
                call.resolve(result)

            } catch (e: Exception) {
                Log.e("LocalAIPlugin", "Inference failed", e)
                call.reject("AI inference failed: ${e.message}")
            }
        }
    }
}
