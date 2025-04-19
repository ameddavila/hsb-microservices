#pragma once
#ifdef ZKCAMERALIB_EXPORTS
	//#define ZKCAMERALIB_API __declspec(dllexport)
	#define ZKCAMERALIB_API
#else
	#define ZKCAMERALIB_API __declspec(dllimport)
#endif
#define SDK_CALL_CONVENTION __stdcall

#include <vector>
#include <string>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif // __cplusplus

	struct CustomData{
		//对应图像帧号
		int64_t frame_index;
		//对应图像size
		int32_t width;
		int32_t height;
		//自定义json数据
		char *customData;
	};

	struct VideoData
	{
		//视频帧帧号
		uint32_t frame_index;
		//解析长度(用于校验jpeg数据完整性，如果为0则表示没有长度信息)
		uint32_t ori_length;
		//实际数据长度
		uint32_t data_length;
		//数据buffer, 使用后需要用户通过delete[]释放
		unsigned char* data;
	};

	//原始的buffer回调
	typedef void(__stdcall *FrameBufferCallback)(unsigned char* data, int size);
	//视频数据回调
	typedef void(__stdcall *VideoDataCallback)(void *pUserParam, VideoData data);
	//人脸数据回调
	typedef void(__stdcall *CustomDataCallback)(void *pUserParam, CustomData data);
	//byte数据回调
	/*
	*字节数据回调目的是为了其他接口调用方便
	*视频数据, data为原始jpeg数据
	*私有数据, data为FaceData结构体的数组( FaceData[face_count] )
	*/
	typedef void(__stdcall *VideoByteDataCallback)(char* data, int length, int ori_length, unsigned int frame_index);
	typedef void(__stdcall *CustomByteDataCallback)(char* data,int length, int face_count, int w, int h, unsigned int frame_index);

	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_Init();
	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_Terminate();

	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_GetDeviceCount();
	//1: rgb camera 2: IR camera 
	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_GetDeviceType(int index);
	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_OpenDevice(int index, int w, int h, int fps, void **handle);
	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_CloseDevice(void *handle);
	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_GetCapWidth(void *handle);
	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_GetCapHeight(void *handle);
	ZKCAMERALIB_API int SDK_CALL_CONVENTION ZKCamera_FreePointer(void *pPointer);

	//设置原始数据回调函数（如果希望使用视频和人脸数据回调请不要设置该回调）
	//ZKCAMERALIB_API void SDK_CALL_CONVENTION ZKCamera_SetDataCallback(FrameBufferCallback func);
	//设置视频数据和人脸数据回调（如果已经设置了原始数据回调，则视频和人脸数据回调无效）
	ZKCAMERALIB_API void SDK_CALL_CONVENTION ZKCamera_SetDataCallback(void *handle, VideoDataCallback videoCallback, CustomDataCallback customCallback, void *pUserParam);

#ifdef __cplusplus
}
#endif // __cplusplus