# 범위가 제한된 member context

member note는 artifact state, spec 또는 brief, project canon, Git을 보충할 뿐 덮어쓰지 않는다. 다른 branch나 worktree에만 있는 byte를 설명할 수 있다. 선택된 artifact key에 대해 `.devflow/team/*/<artifact-key>.md`만 읽고, 각 note의 좌표를 현재 checkout과 비교한다. 일치하지 않는 내용은 공유된 사실로 취급하지 말고 불일치로 드러낸다.

인계하기 전에 note 없이도 state와 canon만으로 작업을 이어갈 수 있게 만든다. safe point 이후의 실제 local delta, 환경에만 해당하는 정보, 다음 actor에게 필요한 미확인 의심이 여전히 있다면 자신의 범위가 제한된 note를 쓰거나 교체한다. 그런 정보가 없으면 note를 만들지 않는다. artifact key와 현재 branch 또는 worktree를 밝힌 뒤, 실제로 해당하는 내용만 기록한다. artifact key는 불투명한 Sketch 또는 Work ID이며, Adoption에는 고정 key `adoption`을 사용한다.

안정적인 `<member>` 값에는 repository의 `git config user.name`을 slug로 변환해 사용한다. 값이 없거나 안정적인 slug를 만들 수 없으면 registry를 임의로 만들지 말고 사용자에게 짧은 team label 하나를 요청한다. 같은 member를 사용하는 여러 agent가 이 artifact에 대해 note를 구분해야 할 때만 짧은 label을 추가한다. spec이나 state를 복사하거나, verdict를 기록하거나, progress log를 관리하거나, state에서 note를 가리키는 pointer를 추가하지 않는다.
