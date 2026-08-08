import type { Messages } from './index'

export const ko: Messages = {
  label: '한국어',
  lang: 'ko',
  link: '/ko/',
  description: 'SARO Lab',

  menu_docs: '문서',
  menu_projects: '프로젝트',
  menu_tool: '도구',
  nav_prev: '이전',
  nav_next: '다음',
  page_not_found: '페이지를 찾을 수 없습니다',
  open_site: '사이트 보기',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: '새 탭에서 열립니다',
  copy_code: '복사',

  home_tagline: 'SARO Lab 오픈소스 프로젝트',
  home_projects: '프로젝트',
  home_tools: '도구',

  proj_dat_tag: '분산 액세스 토큰',
  proj_dat_desc:
    'Stateless HTTP 서비스를 위한 분산 액세스 토큰 시스템입니다. 별도 인증키 발급 시스템을 지원하여 고정 키 문제를 해결함과 동시에 데이터 암호화를 기본으로 지원하며, JSON이 아닌 바이너리 포맷으로 최적의 경량화와 속도를 제공합니다.',

  proj_ticketing_tag: '분산 락 서버',
  proj_ticketing_desc:
    '서버와 프로세스의 실행 순서를 정밀하게 제어하는 고성능 오픈소스 분산 락 서비스입니다. 한정 수량 초과 판매, 중복 좌석 배정, 쿠폰 동시 사용처럼 트래픽이 한꺼번에 몰리는 순간 발생하는 동시성 장애를 완벽하게 차단합니다.',

  proj_nabi_tag: 'WYSIWYG 에디터',
  proj_nabi_desc:
    '프레임워크 종속성을 완전히 제거하여 바닐라 JS부터 React, Vue, Svelte까지 어떤 환경에서든 유연하게 도입할 수 있는 WYSIWYG 에디터입니다. 텍스트 편집, 파일 업로드, 표 정렬 등 풍부한 기본 기능은 물론 사용자 커스텀 기능 추가와 완전히 자유로운 스타일링을 지원합니다.',

  proj_unixtime_tag: '무한 Unixtime',
  proj_unixtime_desc:
    '기원전부터 무한한 미래까지 모든 시간 범위를 정확하게 다룰 수 있는 타임존 및 날짜 처리 라이브러리입니다. 모든 객체의 불변성을 유지하여 과거 날짜의 지방 평균시(LMT) 오차를 차단하고, 각종 포맷 파싱과 타임존 기능을 지원하여 npm과 바닐라 번들 환경에서 유연하게 활용할 수 있습니다.',

  live: '실시간',
  now: '현재',
  year: '연',
  month: '월',
  day: '일',
  hour: '시',
  minute: '분',
  second: '초',
  seconds: '초',
  millisecond: '밀리초',

  doc_reference: 'API 문서',
  doc_install: '설치',

  unixtime_timezone: '타임존 오프셋',
  unixtime_timezone_note:
    '타임존 데이터베이스를 쓰지 않는다. 모든 API 가 분 단위 고정 오프셋을 받으며 부호는 Date.prototype.getTimezoneOffset 과 같다. 그래서 옛 날짜에 지방 평균시가 끼어들지 않는다.',
  unixtime_create: '생성',
  unixtime_parse: '파싱',
  unixtime_parse_note:
    '파싱은 포맷과 같은 형식을 따른다. 형식이 맞지 않으면 추측하지 않고 예외를 던진다.',
  unixtime_read: 'Unixtime',
  unixtime_read_note: '기본으로 bigint로 반환되며, $를 쓰면 number로 반환된다.',
  unixtime_detail: '날짜시간, 날짜',
  unixtime_detail_note:
    '여러 필드가 필요하면 개별 게터보다 이쪽을 쓴다. 자리올림이 한 번에 끝나서 음수 타임스탬프에서도 값이 어긋나지 않는다.',
  unixtime_format: '포맷',
  unixtime_relative: '상대 시간',
  unixtime_relative_note:
    'toRelative 현재시간으로부터 상대시간을 돌려준다.',
  unixtime_date: '날짜',
  unixtime_date_note: '모든 값은 오프셋을 마지막 인자로 받고, 생략하면 브라우저 타임존을 쓴다.',
  unixtime_week: '요일·주차',
  unixtime_week_note:
    '일반 주차는 일요일 시작에 최소 1일, ISO 주차는 월요일 시작에 최소 4일 기준이다.',
  unixtime_time: '시간',
  unixtime_move: '이동',
  unixtime_move_note: '인스턴스는 불변이라 호출마다 새 값이 나온다. 월·연 이동은 일자를 유지하되, 없는 날짜면 그 달의 말일로 맞춘다.',
  unixtime_compare: '비교',
  unixtime_compare_note: '비교 함수는 팩토리가 받는 값이면 무엇이든 받으므로 Date 나 숫자를 변환할 필요가 없다.',
  unixtime_types: '타입',
}
