// * 서버 예외 반환 타입
export interface ServerException {
  message?: string; // 에러 메시지
  path?: string; // 에러 발생 경로
  details?: any; // 추가 세부 정보
}
