# member 작업면과 범위가 제한된 context

Sketch는 `.devflow/team/<current-member>/sketches/<artifact-id>/` 전체를 현재 member의 개인 탐구 작업면으로 사용한다. 다른 member의 Sketch를 기본 탐색하거나 읽거나 이어받지 않는다. 이 경계는 중간 질문과 가설을 서로의 입력으로 취합하지 않게 하지만 repository 접근 권한을 제한하지는 않는다. 확정된 결론만 Sketch landing 계약을 통해 project canon 또는 Direct로 올린다.

개인 Sketch 폴더가 brief, state와 선택적인 findings를 모두 소유하므로 별도의 `.devflow/team/<member>/<sketch-id>.md` note를 만들지 않는다. `next_route`는 같은 member가 수행할 다음 Devflow 역할을 고르며 다른 member에게 탐구 관리권을 넘기지 않는다.

Work와 Adoption의 member note는 공유 artifact state, spec, project canon과 Git을 보충할 뿐 덮어쓰지 않는다. 선택한 Work ID 또는 고정 key `adoption`에 대해 `.devflow/team/*/<artifact-key>.md`만 읽고, 각 note의 branch 또는 worktree 좌표를 현재 checkout과 비교한다. 일치하지 않는 내용은 공유 사실로 취급하지 말고 불일치로 드러낸다.

공유 artifact를 다른 actor가 이어가기 전에 note 없이도 state와 canon만으로 다음 행동을 알 수 있게 만든다. safe point 이후의 실제 local delta, 환경에만 해당하는 정보 또는 다음 actor에게 필요한 미확인 의심이 남아 있을 때만 자신의 note를 쓰거나 교체하고, note 본문에 현재 branch 또는 worktree 좌표를 밝힌다. 그런 정보가 없으면 note를 만들지 않는다. 같은 member의 여러 agent를 실제로 구분해야 할 때만 note 본문에 짧은 label을 덧붙이며 파일명은 바꾸지 않는다. spec이나 state를 복사하거나, verdict를 기록하거나, progress log를 관리하거나, state에서 note를 가리키는 pointer를 추가하지 않는다. Work 또는 Adoption이 닫히면 관련 member note도 제거하며, Git이 필요한 이력을 보존한다.
