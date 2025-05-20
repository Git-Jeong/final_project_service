commit;

insert into com.MEMBER(ID, PW, NICK, PHONE, ADDR)
VALUES('admin', 'admin', 'JeongJin', '010-4569-9427', '전라남도');

SELECT * FROM com.member;

DELETE FROM com.MEMBER WHERE id='admin';