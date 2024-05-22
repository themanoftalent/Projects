package com.mertg.drawcameraapp.view

import android.content.Context
import android.net.Uri
import androidx.activity.ComponentActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Camera
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FlipCameraAndroid
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.mertg.drawcameraapp.viewmodel.CameraViewViewModel
import java.io.File
import java.util.concurrent.Executor
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

@Composable
fun CameraView(
    fileDirectory: File,
    executor: Executor,
    onImageCaptured: (Uri) -> Unit,
    onError: (ImageCaptureException) -> Unit
) {
    val cameraViewViewModel : CameraViewViewModel = viewModel()

    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    val preview = Preview.Builder().build()
    val previewView = remember { PreviewView(context) }
    var cameraSelector by remember { mutableStateOf(CameraSelector.DEFAULT_BACK_CAMERA) }
    val imageCapture: ImageCapture = remember { ImageCapture.Builder().build() }

    val contextToFinish = LocalContext.current as? ComponentActivity ?: return


    LaunchedEffect(cameraSelector) {
        val cameraProvider = context.getCameraProvider()
        cameraProvider.unbindAll()
        cameraProvider.bindToLifecycle(
            lifecycleOwner,
            cameraSelector,
            preview,
            imageCapture
        )
        preview.setSurfaceProvider(previewView.surfaceProvider)

    }
    Column(Modifier.fillMaxSize()){
        Row(modifier = Modifier
            .fillMaxWidth()
            .weight(1f),// Top Left / Back button
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.Start)
        {
            IconButton(
                onClick = {
                    contextToFinish.finish()
                },
                modifier = Modifier.padding(3.dp)
            ) {
                Icon(Icons.Filled.Close, "Geri")
            }
        }

        Row(modifier = Modifier // Middle Center / Camera Display
            .fillMaxSize()
            .weight(8f),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center)
        {
            AndroidView({ previewView }, modifier = Modifier.fillMaxWidth())
        }

        Row( // Bottom Row / Photo Shoot button and toggle camera button
            modifier = Modifier
                .fillMaxWidth()
                .weight(2f),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center)
        {
            Column( // Camera Shoot button / Bottom Left
                modifier = Modifier.fillMaxSize().weight(1.5f),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.End
            ) {
                IconButton(
                    modifier = Modifier.size(85.dp),
                    onClick = {
                        cameraViewViewModel.takePhoto(
                            imageCapture = imageCapture,
                            outputDirectory = fileDirectory,
                            executor = executor,
                            onImageCaptured = onImageCaptured,
                            onError = onError
                        )
                    },
                    content = {
                        /*Icon(   // Old Photoshoot Icon
                            painter = painterResource(id = R.drawable.lens_v),
                            contentDescription = null,
                            tint = Color.Blue,
                            modifier = Modifier
                                .size(150.dp)
                                .padding(1.dp)
                                .border(1.dp, Color.White, CircleShape)
                        )*/
                        Icon(
                            Icons.Filled.Camera,"Camerashoot Icon",
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                )
            }
            Column( // Toggle camera button / Bottom Right
                modifier = Modifier.fillMaxSize().weight(1f),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.Start
            ) {
                IconButton(
                    modifier = Modifier.size(35.dp),
                    onClick = {
                        if (cameraSelector == CameraSelector.DEFAULT_BACK_CAMERA) {
                            cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA
                            cameraViewViewModel.isCameraFront.value = true
                        } else {
                            cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
                            cameraViewViewModel.isCameraFront.value = false
                        }
                    }) {
                    Icon(Icons.Filled.FlipCameraAndroid,"Toggle Camera",
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(start = 3.dp))
                }
            }
        }
    }
    /*    Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
            // Old Camera View
        }*/
}

suspend fun Context.getCameraProvider(): ProcessCameraProvider =
    suspendCoroutine {
        ProcessCameraProvider.getInstance(this).also { future  ->
            future.addListener({
                it.resume(future.get())
            }, ContextCompat.getMainExecutor(this))
        }
    }

