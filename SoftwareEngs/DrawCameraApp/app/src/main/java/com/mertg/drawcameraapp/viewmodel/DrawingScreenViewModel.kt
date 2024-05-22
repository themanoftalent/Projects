package com.mertg.drawcameraapp.viewmodel

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.Path
import android.net.Uri
import android.provider.MediaStore
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.ViewModel
import com.mertg.drawcameraapp.model.Line
import com.mertg.drawcameraapp.util.rotateImageIfRequired
import java.util.Stack

enum class DrawingMode {
    DRAW,
    ERASE
}

class DrawingScreenViewModel : ViewModel() {

    var brushColor: MutableState<Color> = mutableStateOf(Color.Red)
    var brushStroke: MutableState<Float> = mutableFloatStateOf(8f)
    var drawingMode: MutableState<DrawingMode> = mutableStateOf(DrawingMode.DRAW)
    var eraserPosition: MutableState<Offset?> = mutableStateOf(null)
    var eraserSize: MutableState<Float> = mutableFloatStateOf(24f)

    var isButtonEnabled: MutableState<Boolean> = mutableStateOf(true)

    val lines: MutableList<Line> = mutableStateListOf()

    val colorOptions = listOf(
        Color.Red, Color.Green, Color.Blue, Color.Yellow,
        Color.White, Color.Magenta, Color.Black
    )
//    var isUndoStackEmpty: MutableState<Boolean> = mutableStateOf(true)
//    var isRedoStackEmpty: MutableState<Boolean> = mutableStateOf(true)

//    val undoStack: Stack<Line> = Stack()
//    val redoStack: Stack<Line> = Stack()

//    fun undoLastDrawing() {
//        if (undoStack.isNotEmpty()) {
//            val lastLine = undoStack.pop()
//            redoStack.push(lastLine)
//            lines.remove(lastLine)
//        }
//    }
//
//    fun redoLastDrawing() {
//        if (redoStack.isNotEmpty()) {
//            val lastLine = redoStack.pop()
//            undoStack.push(lastLine)
//            lines.add(lastLine)
//        }
//    }

    fun saveImageWithDrawings(
        context: Context,
        photoUri: Uri,
        lines: List<Line>,
        imageWidthPx: Int,
        imageHeightPx: Int,
        isCameraFrontCameraRotation: Boolean,
        saveDrawings: Boolean
    ) {
        // Load the original image and adjust orientation if required
        val originalBitmap = rotateImageIfRequired(
            context,
            BitmapFactory.decodeStream(context.contentResolver.openInputStream(photoUri)),
            photoUri
        )

        // Prepare the bitmap for drawing
        val mutableBitmap = originalBitmap.copy(Bitmap.Config.ARGB_8888, true)
        val resizedBitmap = Bitmap.createScaledBitmap(mutableBitmap, imageWidthPx, imageHeightPx, true)

        val canvasBitmap = if (isCameraFrontCameraRotation) {
            // Flip photo if front camera
            flipBitmap(resizedBitmap)
        } else {
            // Keep original if back camera
            resizedBitmap
        }

        // Draw on the canvas
        val canvas = android.graphics.Canvas(canvasBitmap)
        val paint = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.STROKE
            strokeCap = Paint.Cap.ROUND
            strokeJoin = Paint.Join.ROUND
        }

        // Use Path for drawing lines
        val path = Path()
        lines.forEach { line ->
            paint.color = line.color.toArgb()
            paint.strokeWidth = line.strokeWidth
            path.moveTo(line.start.x, line.start.y)
            path.lineTo(line.end.x, line.end.y)
            canvas.drawPath(path, paint)
            path.reset()
        }

        // Save the final image with drawings
        saveBitmapToGallery(context, canvasBitmap, "Drawing")
    }



    fun saveBitmapToGallery(context: Context, bitmap: Bitmap, fileNameSuffix: String) {
        val saveUri = MediaStore.Images.Media.insertImage(
            context.contentResolver,
            bitmap,
            "Image_${System.currentTimeMillis()}",
            null
        )

        // Update gallery
        saveUri?.let {
            val savedImageUri = Uri.parse(saveUri)
            val mediaScanIntent = Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE)
            mediaScanIntent.data = savedImageUri
            context.sendBroadcast(mediaScanIntent)
            Toast.makeText(context, "Image saved to gallery.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun flipBitmap(bitmap: Bitmap): Bitmap {
        val matrix = Matrix().apply {
            postScale(-1f, 1f, (bitmap.width / 2).toFloat(), (bitmap.height / 2).toFloat())
        }
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    }

    fun getBitmapSizeFromUri(context: Context, uri: Uri): Pair<Int, Int> {
        val inputStream = context.contentResolver.openInputStream(uri)
        val options = BitmapFactory.Options()
        options.inJustDecodeBounds = true
        BitmapFactory.decodeStream(inputStream, null, options)
        val height = options.outWidth
        val width = options.outHeight
        return Pair(width, height)
    }
}
