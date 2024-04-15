package com.mertg.drawcameraapp.view

import com.mertg.drawcameraapp.viewmodel.MainViewModel
import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import com.mertg.drawcameraapp.util.getCurrentContext
import com.mertg.drawcameraapp.viewmodel.CameraViewViewModel
import com.mertg.drawcameraapp.viewmodel.DrawingScreenViewModel


@Composable
fun MainContent() {
    val context = getCurrentContext()

    val mainViewModel: MainViewModel = viewModel()
    val cameraViewViewModel : CameraViewViewModel = viewModel()
    val drawingScreenViewModel : DrawingScreenViewModel = viewModel()

    if (mainViewModel.showCamera.value) {
        cameraViewViewModel.isCameraFront.value = false

        drawingScreenViewModel.redoStack.clear()
        drawingScreenViewModel.undoStack.clear()
        drawingScreenViewModel.lines.clear()

        CameraView(
            fileDirectory = mainViewModel.directoryFile,
            executor = mainViewModel.cameraExecutor,
            onImageCaptured = mainViewModel::handleImageCapture,
            onError = {}
        )
    }
    if (mainViewModel.showPhoto.value) {
        if (mainViewModel.showDrawingScreen.value) {
            DrawingScreen()
        }
    }

}