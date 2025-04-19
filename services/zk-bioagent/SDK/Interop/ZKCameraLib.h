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
		//��Ӧͼ��֡��
		int64_t frame_index;
		//��Ӧͼ��size
		int32_t width;
		int32_t height;
		//�Զ���json����
		char *customData;
	};

	struct VideoData
	{
		//��Ƶ֡֡��
		uint32_t frame_index;
		//��������(����У��jpeg���������ԣ����Ϊ0���ʾû�г�����Ϣ)
		uint32_t ori_length;
		//ʵ�����ݳ���
		uint32_t data_length;
		//����buffer, ʹ�ú���Ҫ�û�ͨ��delete[]�ͷ�
		unsigned char* data;
	};

	//ԭʼ��buffer�ص�
	typedef void(__stdcall *FrameBufferCallback)(unsigned char* data, int size);
	//��Ƶ���ݻص�
	typedef void(__stdcall *VideoDataCallback)(void *pUserParam, VideoData data);
	//�������ݻص�
	typedef void(__stdcall *CustomDataCallback)(void *pUserParam, CustomData data);
	//byte���ݻص�
	/*
	*�ֽ����ݻص�Ŀ����Ϊ�������ӿڵ��÷���
	*��Ƶ����, dataΪԭʼjpeg����
	*˽������, dataΪFaceData�ṹ�������( FaceData[face_count] )
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

	//����ԭʼ���ݻص����������ϣ��ʹ����Ƶ���������ݻص��벻Ҫ���øûص���
	//ZKCAMERALIB_API void SDK_CALL_CONVENTION ZKCamera_SetDataCallback(FrameBufferCallback func);
	//������Ƶ���ݺ��������ݻص�������Ѿ�������ԭʼ���ݻص�������Ƶ���������ݻص���Ч��
	ZKCAMERALIB_API void SDK_CALL_CONVENTION ZKCamera_SetDataCallback(void *handle, VideoDataCallback videoCallback, CustomDataCallback customCallback, void *pUserParam);

#ifdef __cplusplus
}
#endif // __cplusplus