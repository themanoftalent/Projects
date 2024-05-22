package com.mertg.drawcameraapp.viewmodel

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.mertg.drawcameraapp.MainActivity
import com.mertg.drawcameraapp.R
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors


class MainViewModel : ViewModel() {
    lateinit var directoryFile: File
    lateinit var cameraExecutor: ExecutorService

    var showCamera: MutableState<Boolean> = mutableStateOf(false)
    var showPhoto: MutableState<Boolean> = mutableStateOf(false)
    var showDrawingScreen: MutableState<Boolean> = mutableStateOf(false)

    lateinit var photoUri: Uri

    fun initializeCamera() {
        showCamera.value = true
    }

    fun goCameraScreen(){
        showPhoto.value = false
        showCamera.value = true
    }

    fun goCameraScreenWithBack(context : Context){
        showPhoto.value = false
        showCamera.value = true

        val intent = Intent(context,MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        context.startActivity(intent)
        if(context is  Activity){
            context.finish()
        }
    }

    fun handleImageCapture(uri: Uri) {
        showCamera.value = false
        photoUri = uri
        showPhoto.value = true

        showDrawingScreen.value = true
    }

   /*
   fun savePhotoToGallery(context: Context, photoUri: Uri) {
        val mediaScanIntent = Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE)
        mediaScanIntent.data = photoUri
        context.sendBroadcast(mediaScanIntent)
    }
    */

    fun getDirectoryFile(context: Context) {
        val mediaDir = context.externalMediaDirs.firstOrNull()?.let {
            File(it, context.getString(R.string.takenPhoto)).apply { mkdirs() }
        }
        directoryFile = if (mediaDir != null && mediaDir.exists()) mediaDir else context.filesDir
    }

    fun initializeCameraExecutor() {
        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    fun onDestroy() {
        cameraExecutor.shutdown()
    }
}
