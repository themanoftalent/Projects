package com.mertg.drawcameraapp.viewmodel

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.graphics.Paint
import android.net.Uri
import android.provider.MediaStore
import android.util.MutableBoolean
import android.widget.Toast
import androidx.annotation.Px
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.lifecycle.ViewModel
import com.mertg.drawcameraapp.model.Line
import com.mertg.drawcameraapp.util.rotateImageIfRequired
import java.util.Stack

class DrawingScreenViewModel : ViewModel(){
    private lateinit var lastBitmap : Bitmap

    var brushColor : MutableState<Color> = mutableStateOf(Color.Red)
    var brushStroke : MutableState<Float> = mutableFloatStateOf(8f)

    var isButtonEnabled : MutableState<Boolean> = mutableStateOf(true)

    val lines : MutableList<Line> = mutableStateListOf()

    var isUndoStackEmpty : MutableState<Boolean> = mutableStateOf(true)
    var isRedoStackEmpty : MutableState<Boolean> = mutableStateOf(true)

    val undoStack: Stack<Line> = Stack()
    val redoStack: Stack<Line> = Stack()


    fun undoLastDrawing() {
        if (undoStack.isNotEmpty()) {
//            isUndoStackEmpty.value = false
            val lastLine = undoStack.pop()
            redoStack.push(lastLine)
            lines.remove(lastLine)
        } else {
//            isUndoStackEmpty.value = true
        }
    }

    fun redoLastDrawing() {
        if (redoStack.isNotEmpty()) {
//            isRedoStackEmpty.value = false
            val lastLine = redoStack.pop()
            undoStack.push(lastLine)
            lines.add(lastLine)
        } else {
//            isRedoStackEmpty.value = true
        }
    }

    fun saveImageWithDrawings(context: Context, photoUri: Uri, lines: List<Line>, imageWidthPx: Int, imageHeightPx: Int, isCameraFrontCameraRotation : Boolean) {
        // Load Photo and fix orientation
        val bitmap = rotateImageIfRequired(context, BitmapFactory.decodeStream(context.contentResolver.openInputStream(photoUri)), photoUri)

        // Draw the lines onto the image
        val mutableBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true)
        val resizedBitmap = Bitmap.createScaledBitmap(mutableBitmap, imageWidthPx, imageHeightPx, true)
        if(isCameraFrontCameraRotation){
            // Flip photo if frontcamera
            lastBitmap = flipBitmap(resizedBitmap)
        }
        else if(!isCameraFrontCameraRotation){
            // Dont flip photo if backcamera
            lastBitmap = resizedBitmap
        }
        val canvas = android.graphics.Canvas(lastBitmap)
        val paint = Paint().apply {
            isAntiAlias = true
            color = brushColor.value.toArgb()
            strokeWidth = brushStroke.value
            style = Paint.Style.STROKE
        }

        lines.forEach { line ->
            paint.color = line.color.toArgb()
            canvas.drawLine(line.start.x, line.start.y, line.end.x, line.end.y, paint)
        }

        val saveUri = MediaStore.Images.Media.insertImage(
            context.contentResolver,
            lastBitmap,
            "Drawing_${System.currentTimeMillis()}",
            null
        )

        // Take the URI and scan the file to the gallery
        saveUri?.let {
            val savedImageUri = Uri.parse(saveUri)
            val mediaScanIntent = Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE)
            mediaScanIntent.data = savedImageUri
            context.sendBroadcast(mediaScanIntent)
            Toast.makeText(context, "Çizim galeriye kaydedildi.", Toast.LENGTH_SHORT).show()
        }
        isButtonEnabled.value = true
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
