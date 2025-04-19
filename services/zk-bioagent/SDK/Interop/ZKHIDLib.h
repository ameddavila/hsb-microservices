#pragma once
#ifdef WIN32
#ifdef ZKHIDLIB_EXPORTS
	#define ZKHIDLIB_API
	//#define ZKHIDLIB_API __declspec(dllexport)
#else
	#define ZKHIDLIB_API __declspec(dllimport)
#endif
#define SDK_CALL_CONVENTION __stdcall
#else
#define ZKHIDLIB_API
#define SDK_CALL_CONVENTION
#endif

#include <string>

#define ZKHID_ERROR_NONE				0
#define ZKHID_ERROR_OPEN				-1 //打开设备失败
#define ZKHID_ERROR_NOTOPEN			-2 //设备未打开
#define ZKHID_ERROR_PARAMETER			-3 //参数错误
#define ZKHID_ERROR_MEMORY			-4 //内存分配失败，没有分配到足够的内存
#define ZKHID_ERROR_NO_MEMORY			-5 //用户申请的内存空间不足
#define ZKHID_ERROR_SEND_CMD			-6 //发送命令失败
#define ZKHID_ERROR_READ_TIMEOUT		-7 //读取数据失败
#define ZKHID_ERROR_SET_CONFIG		-8 //设置失败
#define ZKHID_ERROR_IO				-9 //打开文件失败
#define ZKHID_ERROR_INVALID_FILE		-10 //文件异常
#define ZKHID_ERROR_INVALID_HEADER	-11 //非法协议头
#define ZKHID_ERROR_CHECKSUM			-12 //非法协议头
#define ZKHID_ERROR_LOSS_PACKET		-13 //非法协议头

enum ConfigType{ 
	COMMON_CONFIG = 1, 
	CAPTURE_FILTER_CONFIG = 2, 
	MOTION_DETECT_CONFIG = 3, 
	PALM_CONFIG = 4, 
	DEVICE_INFORMATION = 5,
	DEVICE_TIME = 6
};

enum SnapShotType{ 
	SNAPSHOT_NIR = 0, 
	SNAPSHOT_VL = 1
};

enum SendFileType{ 
	UPGRADE_IMAGE = 0, 
	SEND_FILE = 1
};

enum ManageType{ 
	ADD_PERSON = 1, 
	DEL_PERSON = 2, 
	CLEAR_PERSON = 3, 
	GET_PERSON = 4, 
	QUERY_ALL_PERSON = 5, 
	QUERY_STATISTICS = 6, 
	ADD_FACE = 7,
	ADD_FACE_REG = 8,
	DETECT_FACE_REG = 9,
	REG_START = 10,
	REG_END = 11,
	DETECT_PALM_REG = 12,
	ADD_PALM = 13,
	ADD_PALM_REG = 14,
	MERGE_PALM_REG = 15,
	DEL_FACE_CACHEID = 16,
	DEL_PALM_CACHEID = 17,
	ATT_RECORD_COUNT = 18,
	EXPORT_ATT_RECORD = 19,
	CLEAR_ATT_RECORD = 20
};

#ifdef __cplusplus
extern "C" {
#endif // __cplusplus

	typedef void(SDK_CALL_CONVENTION *SendFileCallback)(void *pUserParam, int progress);

	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_Init();
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_Terminate();
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_GetCount(int *count);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_Open(int index, void **handle);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_Close(void *handle);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_GetConfig(void *handle, int type, char *json, int *len);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_SetConfig(void *handle, int type, char *json);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_RegisterFace(void *handle, const char* json, char *faceData, int *len);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_RegisterPalm(void *handle, const char* json, char *palmData, int *len);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_MergePalm(void *handle, char *palmData, int *len);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_SendFile(void *handle, int fileType, char *filePath, SendFileCallback sendFileCallback, void *pUserParam);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_SnapShot(void *handle, int snapType, char *snapData, int *len);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_Reboot(void *handle, int mode);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_PollMatchResult(void *handle, char *json, int *len);
	ZKHIDLIB_API int SDK_CALL_CONVENTION ZKHID_ManageModuleData(void *handle, int type, char *json, char *result, int *len);

#ifdef __cplusplus
}
#endif // __cplusplus